import { IRefBasic } from "./IRef";

export interface IReview {
  id: string;
  comment: string;
  stars: number;
  ownerName: string;
  ownerPhoto?: string;
  owner: IRefBasic;
  parent: IRefBasic;
  creationTime: string;
}
