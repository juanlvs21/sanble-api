import { IRefBasic } from "./IRef";

export enum EReviewType {
  STAND = "stand",
  FAIR = "fair",
}

export interface IReview {
  id: string;
  comment: string;
  stars: number;
  type: EReviewType;
  ownerName: string;
  ownerPhoto?: string;
  owner: IRefBasic;
  parent: IRefBasic;
}
