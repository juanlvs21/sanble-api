import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";

import { ErrorHandler } from "../error";
import { IFair } from "../interfaces/IFair";
import {
  EInvitationType,
  IInvitation,
  IInvitationForm,
} from "../interfaces/IInvitation";
import {
  ENotificationType,
  ISendNotification,
} from "../interfaces/INotification";
import { Timestamp, auth, db } from "../utils/firebase";
import { sendNotification } from "../utils/sendNotification";
import { invitationDataFormat } from "../utils/utilsInvitation";

export class InvitationService {
  static async sendInvitation(body: IInvitationForm, uid: string) {
    const user = await auth.getUser(uid);
    const userDoc = await db.collection("users").doc(uid).get();

    if (!user || !userDoc.exists)
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
      sentBy: user.uid,
      fairRef: db.doc(`fairs/${body.fairID}`),
      standRef: db.doc(`stands/${body.standID}`),
      fairOwnerRef: fairData.ownerRef,
      standOwnerRef: standData.ownerRef,
      creationTimestamp: Timestamp.now(),
    };

    await db.collection("invitations").doc(id).set(newInvitation);

    let notificationData: Partial<ISendNotification> = {};

    if (body.type === EInvitationType.FAIR_TO_STAND) {
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

    if (body.type === EInvitationType.STAND_TO_FAIR) {
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
}
