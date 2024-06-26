import { DocumentReference, Timestamp } from "firebase-admin/firestore";
import { IFair } from "./IFair";
import { IStand } from "./IStand";
import { extend } from "dayjs";
import { IQueryListRequest } from "./IRequest";

export enum EInvitationType {
  STAND_INVITATION = "STAND_INVITATION",
  FAIR_REQUEST = "FAIR_REQUEST",
}

export interface IInvitationForm {
  type: EInvitationType;
  fairID: string;
  standID: string;
  sentTo: string;
}

export interface IInvitation extends IInvitationForm {
  id: string;
  sentBy: string;
  sentTo: string;
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

export interface IInvitationInputStandsQueryParams
  extends Omit<IQueryListRequest, "orderBy" | "orderDir"> {
  fairID?: string;
}

export interface IInvitationInputFairsQueryParams
  extends Omit<IQueryListRequest, "orderBy" | "orderDir"> {
  standID?: string;
}

export interface IInvitationInputFairs extends IFair {
  requestSent: boolean;
  invitationId: string;
}

export interface IInvitationInputStands extends IStand {
  invitationSent: boolean;
  invitationId: string;
}
