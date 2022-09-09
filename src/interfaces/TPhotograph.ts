import { TFair } from "./TFair";

export type TPhotograph = {
  id: string;
  description: string;
  photoUrl: string;
  isCover: boolean;
  createdAt: string;
  fair?: TFair;
  fairId?: never;
};
