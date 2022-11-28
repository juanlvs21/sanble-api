import { Timestamp } from "firebase-admin/firestore";
import { IRefBasic } from "./IRef";

export interface IStandFairParticipates {
  ref: IRefBasic;
  name: string;
  coverUrl?: string;
}

export interface IStand {
  id: string;
  name: string;
  creationTimestamp?: Timestamp;
  creationTime: string;
  coverUrl?: string;
  description: string;
  products: any[]; // TODO: Create the correct data type
  promotions: any[]; // TODO: Create the correct data type
  fairsParticipates: IStandFairParticipates[];
  owner: IRefBasic;
  slogan?: string;
  stars: number;
}
