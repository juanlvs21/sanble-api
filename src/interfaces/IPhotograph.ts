import { Timestamp } from "firebase-admin/firestore";

export interface IPhotograph {
  id: string;
  url: string;
  description: string;
  creationTimestamp?: Timestamp;
  creationTime: string;
  isCover: boolean;
}
