import { Timestamp, DocumentReference } from "firebase-admin/firestore";
import { File } from "formidable";

export interface IPostBase {
  id?: string;
  text: string;
  creationTimestamp?: Timestamp;
  creationTime?: string;
  parent: DocumentReference;
  parentName?: string;
  parentPhoto?: string;
}

export interface IPostForm extends IPostBase {
  files: File[];
}

export interface IPost extends IPostBase {
  fileId: string | null;
  fileUrl: string | null;
  fileName: string | null;
}
