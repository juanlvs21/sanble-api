import { TPromotion } from "./TPromotion";
import { TItems } from "./TItems";

export type TStand = {
  name: string;
  slogan: string;
  description: string;
  items: TItems[];
  promotions: TPromotion[];
  stars: number;
  url_photo: string;
  creationTime: string;
  uuid: string;
  uuid_user: string;
};
