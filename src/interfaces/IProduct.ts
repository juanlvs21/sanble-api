import { DocumentReference, Timestamp } from "../utils/firebase";
import { File } from "formidable";

export enum EProductTypeKey {
  CLOTHES = "clothes",
  ACCESSORIES = "accessories",
  DRINKS = "drinks",
  CANDIES = "candies",
  FOODS = "foods",
}

export enum EProductCurrency {
  BS = "Bs.",
  USD = "$",
}

export interface IProductType {
  id: string;
  key: EProductTypeKey;
  name: string;
}

export interface IProductBase {
  id: string;
  name: string;
  description: string;
  price: string;
  type: EProductTypeKey;
  currency: EProductCurrency;
  parent: DocumentReference;
  creationTimestamp?: Timestamp;
  creationTime?: string;
}

export interface IProductForm extends IProductBase {
  files: File[];
}

export interface IProduct extends IProductBase {
  fileId: string | null;
  fileUrl: string | null;
  fileName: string | null;
}
