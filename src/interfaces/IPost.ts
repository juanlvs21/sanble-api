import { Timestamp } from "firebase-admin/firestore";
import { File } from "formidable";

import { IRefBasic } from "./IRef";

export interface IPostBase {
  id?: string;
  text: string;
  creationTimestamp?: Timestamp;
  creationTime?: string;
  parent: IRefBasic;
}

export interface IPostForm extends IPostBase {
  files: File[];
}

export interface IPost extends IPostBase {
  fileId?: string;
  fileUrl?: string;
  fileName?: string;
}
