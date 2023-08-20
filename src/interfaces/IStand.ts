import { DocumentReference, Timestamp } from "firebase-admin/firestore";

import { IPhotograph } from "./IPhotograph";
import { IRefBasic } from "./IRef";
import { IUserOwnerData } from "./IUser";

export interface IStand {
  id: string;
  name: string;
  creationTimestamp?: Timestamp;
  creationTime: string;
  coverUrl?: string;
  description: string;
  ownerRef: DocumentReference;
  owner: IUserOwnerData;
  slogan?: string;
  stars: number;
  photographs: IPhotograph[];
  contactEmail: string;
  contactPhone: string;
  fairs: DocumentReference[] | IRefBasic[];
}

export interface IStandForm {
  id?: string;
  name: string;
  slogan?: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
}
