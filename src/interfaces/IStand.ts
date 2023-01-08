import { Timestamp } from "firebase-admin/firestore";
import { IRefBasic } from "./IRef";

export interface IStand {
  id: string;
  name: string;
  creationTimestamp?: Timestamp;
  creationTime: string;
  coverUrl?: string;
  description: string;
  products: any[]; // TODO: Create the correct data type
  promotions: any[]; // TODO: Create the correct data type
  owner: IRefBasic;
  slogan?: string;
  stars: number;
  contactEmail: string;
  contactPhone: string;
  fairs: IRefBasic[];
}
