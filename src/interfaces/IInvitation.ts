import { DocumentReference, Timestamp } from "firebase-admin/firestore";
import { IFair } from "./IFair";
import { IStand } from "./IStand";

export enum EInvitationType {
  FAIR_TO_STAND = "FAIR_TO_STAND",
  STAND_TO_FAIR = "STAND_TO_FAIR",
}

export interface IInvitationForm {
  type: EInvitationType;
  fairID: string;
  standID: string;
}

export interface IInvitation extends IInvitationForm {
  id: string;
  sentBy: string;
  fairRef: DocumentReference;
  standRef: DocumentReference;
  fairOwnerRef: DocumentReference;
  standOwnerRef: DocumentReference;
  creationTimestamp?: Timestamp;
}

export interface IInvitationFormatted
  extends Omit<
    IInvitation,
    | "fairRef"
    | "standRef"
    | "fairOwnerRef"
    | "standOwnerRef"
    | "creationTimestamp"
  > {
  creationTime: string;
  fair: IFair;
  stand: IStand;
  fairOwner: {
    id: string;
    name: string;
  };
  standOwner: {
    id: string;
    name: string;
  };
}
