import { Timestamp } from "firebase-admin/firestore";
import { IPhotograph } from "./IPhotograph";
import { IRefBasic } from "./IRef";

export interface IStand {
  id: string;
  name: string;
  creationTimestamp?: Timestamp;
  creationTime: string;
  coverUrl?: string;
  description: string;
  owner: IRefBasic;
  slogan?: string;
  stars: number;
  photographs: IPhotograph[];
  contactEmail: string;
  contactPhone: string;
  fairs: IRefBasic[];
}
