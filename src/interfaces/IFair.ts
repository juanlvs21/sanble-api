import { Timestamp } from "firebase-admin/firestore";

import { IPhotograph } from "./IPhotograph";
import { IRefBasic } from "./IRef";

export enum EFairType {
  ENTREPRENEURSHIP = "entrepreneurship",
  GASTRONOMIC = "gastronomic",
}

export interface IFair {
  id: string;
  name: string;
  geopoint: [number, number] | null;
  creationTimestamp?: Timestamp;
  creationTime: string;
  celebrationDate: string;
  owner: IRefBasic;
  address: string;
  description: string;
  stars: number;
  type: EFairType;
  contactEmail: string;
  contactPhone: string;
  photographs: IPhotograph[];
  coverUrl?: string;
  stands: IRefBasic[];
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
  celebrationDate?: string;
  address: string;
  description: string;
  type: EFairType;
  contactEmail: string;
  contactPhone: string;
}
