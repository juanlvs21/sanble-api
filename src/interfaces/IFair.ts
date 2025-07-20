import { DocumentReference, Timestamp } from "firebase-admin/firestore";

import { IPhotograph } from "./IPhotograph";
import { IRefBasic } from "./IRef";
import { IUserOwnerData } from "./IUser";

export enum EFairType {
  ENTREPRENEURSHIP = "entrepreneurship",
  GASTRONOMIC = "gastronomic",
}

export enum EFairCelebrationType {
  "WEEKLY" = "WEEKLY",
  "MONTHLY" = "MONTHLY",
  "SPECIFIC_DATE" = "SPECIFIC_DATE",
  "NOT_SPECIFIED" = "NOT_SPECIFIED",
}

export interface IFair {
  id: string;
  name: string;
  geopoint: [number, number] | null;
  creationTimestamp?: Timestamp;
  creationTime: string;
  celebrationDate: string;
  ownerRef: DocumentReference;
  owner: IUserOwnerData;
  address: string;
  description: string;
  stars: number;
  type: EFairType;
  contactEmail: string;
  contactPhone: string;
  photographs: IPhotograph[];
  coverUrl?: string;
  stands: DocumentReference[] | IRefBasic[];
}

export interface IFairGeo {
  id: string;
  name: string;
  geopoint: [number, number] | null;
  stars: number;
  type: EFairType;
}

export interface IFairForm {
  id?: string;
  name: string;
  geopoint: [number, number];
  celebrationType?: EFairCelebrationType;
  celebrationWeeklyDay?: number;
  celebrationMonthlyDay?: number;
  celebrationDate?: string;
  address: string;
  description: string;
  type: EFairType;
  contactEmail: string;
  contactPhone: string;
}
