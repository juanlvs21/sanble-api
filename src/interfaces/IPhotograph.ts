import { Timestamp } from "firebase-admin/firestore";

export type IPhotograph = {
  id: string;
  url: string;
  description: string;
  creationTimestamp?: Timestamp;
  creationTime: string;
  isCover: boolean;
};
