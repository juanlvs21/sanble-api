import { DocumentReference } from "firebase-admin/firestore";
import { IRefBasic } from "./IRef";
import { IUserOwnerData } from "./IUser";

export interface IReview {
  id: string;
  comment: string;
  stars: number;
  ownerRef: DocumentReference;
  owner: IUserOwnerData;
  parent: DocumentReference | IRefBasic;
  creationTime: string;
}
