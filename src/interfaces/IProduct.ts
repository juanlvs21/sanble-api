export enum TProductTypeKey {
  CLOTHES = "clothes",
  ACCESSORIES = "accessories",
  DRINKS = "drinks",
  CANDIES = "candies",
  FOODS = "foods",
}

export interface IProductType {
  id: string;
  key: TProductTypeKey;
  name: string;
}
