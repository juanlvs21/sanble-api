import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";

import { IQueryListRequest } from "interfaces/IRequest";
import { ErrorHandler } from "../error";
import { IFair } from "../interfaces/IFair";
import {
  EInvitationType,
  IInvitation,
  IInvitationForm,
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
      const standData = standDataFormat(doc.data() as IStand);
      const findInvitation = invitations.find(
        (invitation) => invitation.standID === standData.id
      );

      stands.push({
        ...standData,
        invitationSent: Boolean(findInvitation),
      });
    });

    const list = stands.length
      ? stands.slice(firstIndexNumber, firstIndexNumber + limitNumber)
      : [];

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
      const fairData = fairDataFormat(doc.data() as IFair);
      const findInvitation = invitations.find(
        (invitation) => invitation.fairID === fairData.id
      );

      fairs.push({
        ...fairData,
        requestSent: Boolean(findInvitation),
      });
    });

    const list = fairs.length
      ? fairs.slice(firstIndexNumber, firstIndexNumber + limitNumber)
      : [];

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
  ) {}
}
