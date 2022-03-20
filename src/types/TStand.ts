export type TStand = {
  id: string;
  name: string;
  description: string;
  slogan?: string;
  stars: number;
  photoUrl?: string;
  createdAt: Date;
  user?: any;
  userId?: never;
  products: any[];
  promotions: any[];
};
