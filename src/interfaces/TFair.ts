export enum EFairType {
  ENTREPRENEURSHIP = "ENTREPRENEURSHIP",
  GASTRONOMIC = "GASTRONOMIC",
}

export type TFair = {
  id: string;
  name: string;
  description: string;
  emailContact?: string;
  phoneContact?: string;
  address: string;
  dateTime?: Date;
  lat?: string;
  lng?: string;
  stars: number;
  type: EFairType;
  createdAt: Date;
  photographs: any[];
  user?: any;
  userId?: never;
};
