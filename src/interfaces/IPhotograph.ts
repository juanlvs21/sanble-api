import { Timestamp } from "firebase-admin/firestore";
import { File } from "formidable";
import { IFormidableFiles } from "./IFile";

export interface IPhotographBase {
  id?: string;
  description: string;
  creationTimestamp?: Timestamp;
  creationTime?: string;
  isCover: boolean;
}

export interface IPhotograph extends IPhotographBase {
  url: string;
}

export interface IPhotographForm extends IPhotographBase {
  files: File[];
}
