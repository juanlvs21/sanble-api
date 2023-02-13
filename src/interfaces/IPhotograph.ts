import { Timestamp } from "firebase-admin/firestore";
import { File } from "formidable";
import { IFormidableFiles } from "./IFile";

export interface IPhotographBase {
  id?: string;
  name: string;
  description: string;
  creationTimestamp?: Timestamp;
  creationTime?: string;
  isCover: boolean;
}

export interface IPhotograph extends IPhotographBase {
  fileId: string;
  url: string;
}

export interface IPhotographForm extends IPhotographBase {
  files: File[];
}
