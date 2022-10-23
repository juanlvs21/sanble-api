import { Timestamp } from "firebase-admin/firestore";

import { IPhotograph } from "./IPhotograph";

export enum EFairType {
  ENTREPRENEURSHIP = "entrepreneurship",
  GASTRONOMIC = "gastronomic",
}

export interface IFair {
  id: string;
  name: string;
  geopoint: [number, number];
  creationTimestamp?: Timestamp;
  creationTime: string;
  celebrationDate: string;
  owner: string;
  address: string;
  description: string;
  stars: number;
  type: EFairType;
  contactEmail: string;
  contactPhone: string;
  photographs: IPhotograph[];
  coverUrl?: string;
}
