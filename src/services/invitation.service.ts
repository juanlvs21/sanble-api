import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";

import { IQueryListRequest } from "interfaces/IRequest";
import { ErrorHandler } from "../error";
import { IFair } from "../interfaces/IFair";
import {
  EInvitationType,
  IInvitation,
  IInvitationForm,
  IInvitationFormatted,
  IInvitationInputFairs,
  IInvitationInputFairsQueryParams,
  IInvitationInputStands,
  IInvitationInputStandsQueryParams,
} from "../interfaces/IInvitation";
import {
  ENotificationType,
  ISendNotification,
} from "../interfaces/INotification";
import { IStand } from "../interfaces/IStand";
import { Timestamp, auth, db } from "../utils/firebase";
import { DEFAULT_LIMIT_VALUE } from "../utils/pagination";
import { sendNotification } from "../utils/sendNotification";
import { fairDataFormat } from "../utils/utilsFair";
import { invitationDataFormat } from "../utils/utilsInvitation";
import { standDataFormat } from "../utils/utilsStand";

export class InvitationService {
  static async getListStands(
    { limit, lastIndex, fairID }: IInvitationInputStandsQueryParams,
    uid: string
  ) {
    const user = await auth.getUser(uid);

    if (!user)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Usuario no encontrado");

    const limitNumber = Number(limit) || DEFAULT_LIMIT_VALUE;
    const firstIndexNumber = Number(lastIndex) || 0;

    const snapshotInvitations = await db
      .collection("invitations")
      .where("sentBy", "==", user.uid)
      .where("fairID", "==", fairID)
      .get();

    const invitations: IInvitation[] = [];

    snapshotInvitations.forEach((doc) => {
      invitations.push(doc.data() as IInvitation);
    });

    const snapshotStands = await db
      .collection("stands")
      .orderBy("name", "desc")
      .where("ownerRef", "==", db.doc(`users/${uid}`))
      .get();

    const stands: IInvitationInputStands[] = [];

    snapshotStands.forEach((doc) => {
      stands.push(doc.data() as any);
    });

    const list = stands.length
      ? stands.slice(firstIndexNumber, firstIndexNumber + limitNumber)
      : [];

    for (let i = 0; i < list.length; i++) {
      const standData = standDataFormat(list[i]);
      const findInvitation = invitations.find(
        (invitation) => invitation.standID === standData.id
      );

      list[i] = {
        ...standData,
        invitationSent: Boolean(findInvitation),
      };
    }

    return {
      list,
      pagination: {
        total: snapshotStands.docs.length || 0,
        lastIndex: firstIndexNumber + list.length,
        limit: limitNumber,
      },
    };
  }

  static async getListFairs(
    { limit, lastIndex, standID }: IInvitationInputFairsQueryParams,
    uid: string
  ) {
    const user = await auth.getUser(uid);

    if (!user)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Usuario no encontrado");

    const limitNumber = Number(limit) || DEFAULT_LIMIT_VALUE;
    const firstIndexNumber = Number(lastIndex) || 0;

    const snapshotInvitations = await db
      .collection("invitations")
      .where("sentBy", "==", user.uid)
      .where("standID", "==", standID)
      .get();

    const invitations: IInvitation[] = [];

    snapshotInvitations.forEach((doc) => {
      invitations.push(doc.data() as IInvitation);
    });

    const snapshotFairs = await db
      .collection("fairs")
      .orderBy("name", "desc")
      .where("ownerRef", "==", db.doc(`users/${uid}`))
      .get();

    const fairs: IInvitationInputFairs[] = [];

    snapshotFairs.forEach((doc) => {
      fairs.push(doc.data() as any);
    });

    const list = fairs.length
      ? fairs.slice(firstIndexNumber, firstIndexNumber + limitNumber)
      : [];

    for (let i = 0; i < list.length; i++) {
      const fairData = fairDataFormat(list[i]);
      const findInvitation = invitations.find(
        (invitation) => invitation.fairID === fairData.id
      );

      list[i] = {
        ...fairData,
        requestSent: Boolean(findInvitation),
      };
    }

    return {
      list,
      pagination: {
        total: snapshotFairs.docs.length || 0,
        lastIndex: firstIndexNumber + list.length,
        limit: limitNumber,
      },
    };
  }

  static async sendInvitation(body: IInvitationForm, uid: string) {
    const user = await auth.getUser(uid);

    if (!user)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Usuario no encontrado");

    const fairDoc = await db
      .collection("fairs")
      .doc(body.fairID ?? "")
      .get();

    if (!fairDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Feria no encontrada");

    const standDoc = await db
      .collection("stands")
      .doc(body.standID ?? "")
      .get();

    if (!standDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Stand no encontrada");

    const fairData = fairDoc.data() as IFair;
    const standData = standDoc.data() as IFair;

    const id = uuidv4();

    const newInvitation: IInvitation = {
      id,
      type: body.type,
      fairID: body.fairID,
      standID: body.standID,
      sentTo: body.sentTo,
      sentBy: user.uid,
      fairRef: db.doc(`fairs/${body.fairID}`),
      standRef: db.doc(`stands/${body.standID}`),
      fairOwnerRef: fairData.ownerRef,
      standOwnerRef: standData.ownerRef,
      creationTimestamp: Timestamp.now(),
    };

    await db.collection("invitations").doc(id).set(newInvitation);

    let notificationData: Partial<ISendNotification> = {};

    if (body.type === EInvitationType.STAND_INVITATION) {
      notificationData = {
        uid: standData.ownerRef.id,
        title: `¡Ey! Tu Stand ${standData.name} tiene una nueva invitación`,
        body: `Has sido invitado a formar parte de la Feria ${fairData.name} por ${user.displayName}`,
        data: {
          type: ENotificationType.INVITATION_RECEIVED,
          redirectURL: `/app/invitaciones/recibidas`,
        },
      };
    }

    if (body.type === EInvitationType.FAIR_REQUEST) {
      notificationData = {
        uid: fairData.ownerRef.id,
        title: `¡Ey! El Stand ${standData.name} te ha hecho una solicitud`,
        body: `${user.displayName} quiere que su Stand forme parte de tu Feria ${fairData.name}`,
        data: {
          type: ENotificationType.REQUEST_RECEIVED,
          redirectURL: `/app/invitaciones/recibidas`,
        },
      };
    }

    await sendNotification(notificationData as ISendNotification);

    const invitationFormatted = await invitationDataFormat(newInvitation);

    return invitationFormatted;
  }

  static async getReceived(
    { limit, lastIndex }: IQueryListRequest,
    uid: string
  ) {
    const limitNumber = Number(limit) || DEFAULT_LIMIT_VALUE;
    const firstIndexNumber = Number(lastIndex) || 0;

    const userAuth = await auth.getUser(uid);

    if (!userAuth)
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, "Usuario no existe");

    const userDataDoc = await db.collection("users").doc(userAuth.uid).get();

    if (!userDataDoc.exists)
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, "Usuario no existe");

    const invitations: IInvitation[] = [];
    const invitationsFormatted: IInvitationFormatted[] = [];
    let totalRecords = 0;

    const snapshot = await db
      .collection("invitations")
      .where("sentTo", "==", userDataDoc.id)
      .get();

    snapshot.forEach(async (doc) => {
      invitations.push(doc.data() as IInvitation);
    });

    totalRecords = snapshot.docs.length;

    const list = invitations.length
      ? invitations.slice(firstIndexNumber, firstIndexNumber + limitNumber)
      : [];

    for (let i = 0; i < list.length; i++) {
      invitationsFormatted.push(await invitationDataFormat(list[i]));
    }

    return {
      list: invitationsFormatted,
      pagination: {
        total: totalRecords,
        lastIndex: firstIndexNumber + list.length,
        limit: limitNumber,
      },
    };
  }

  static async getSent({ limit, lastIndex }: IQueryListRequest, uid: string) {
    const limitNumber = Number(limit) || DEFAULT_LIMIT_VALUE;
    const firstIndexNumber = Number(lastIndex) || 0;

    const userAuth = await auth.getUser(uid);

    if (!userAuth)
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, "Usuario no existe");

    const userDataDoc = await db.collection("users").doc(userAuth.uid).get();

    if (!userDataDoc.exists)
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, "Usuario no existe");

    const invitations: IInvitation[] = [];
    const invitationsFormatted: IInvitationFormatted[] = [];
    let totalRecords = 0;

    const snapshot = await db
      .collection("invitations")
      .where("sentBy", "==", userDataDoc.id)
      .get();

    snapshot.forEach(async (doc) => {
      invitations.push(doc.data() as IInvitation);
    });

    totalRecords = snapshot.docs.length;

    const list = invitations.length
      ? invitations.slice(firstIndexNumber, firstIndexNumber + limitNumber)
      : [];

    for (let i = 0; i < list.length; i++) {
      invitationsFormatted.push(await invitationDataFormat(list[i]));
    }

    return {
      list: invitationsFormatted,
      pagination: {
        total: totalRecords,
        lastIndex: firstIndexNumber + list.length,
        limit: limitNumber,
      },
    };
  }

  static async unsendInvitation(id: string, uid: string) {
    const userAuth = await auth.getUser(uid);

    if (!userAuth)
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, "Usuario no existe");

    const invitationDoc = await db.collection("invitations").doc(id).get();

    if (!invitationDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Invitación no existe");

    const invitationData = invitationDoc.data() as IInvitation;

    if (invitationData.sentBy !== userAuth.uid)
      throw new ErrorHandler(
        StatusCodes.UNAUTHORIZED,
        "No tienes permisos para cancelar esta invitación"
      );

    await db.collection("invitations").doc(id).delete();
  }

  static async declineInvitation(id: string, uid: string) {
    const userAuth = await auth.getUser(uid);

    if (!userAuth)
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, "Usuario no existe");

    const invitationDoc = await db.collection("invitations").doc(id).get();

    if (!invitationDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Invitación no existe");

    const invitationData = invitationDoc.data() as IInvitation;

    if (invitationData.sentTo !== userAuth.uid)
      throw new ErrorHandler(
        StatusCodes.UNAUTHORIZED,
        "No tienes permisos para rechazar esta invitación"
      );

    await db.collection("invitations").doc(id).delete();
  }

  static async acceptInvitation(id: string, uid: string) {
    const userAuth = await auth.getUser(uid);

    if (!userAuth)
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, "Usuario no existe");

    const invitationDoc = await db.collection("invitations").doc(id).get();

    if (!invitationDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Invitación no existe");

    const invitationData = invitationDoc.data() as IInvitation;

    if (invitationData.sentTo !== userAuth.uid)
      throw new ErrorHandler(
        StatusCodes.UNAUTHORIZED,
        "No tienes permisos para aceptar esta invitación"
      );

    const standDoc = await db
      .collection("stands")
      .doc(invitationData.standID)
      .get();

    if (!standDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Stand no existe");

    const fairDoc = await db
      .collection("fairs")
      .doc(invitationData.fairID)
      .get();

    if (!fairDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Feria no existe");

    const standData = standDoc.data() as IStand;
    const fairData = fairDoc.data() as IFair;

    const newStand = {
      ...standData,
      fairs: [...standData.fairs, db.doc(`fairs/${invitationData.fairID}`)],
    };

    await db.collection("stands").doc(standData.id).update(newStand);

    const newFair = {
      ...fairData,
      stands: [...fairData.stands, db.doc(`stands/${invitationData.standID}`)],
    };

    await db.collection("fairs").doc(fairData.id).update(newFair);

    await db.collection("invitations").doc(id).delete();
  }
}
