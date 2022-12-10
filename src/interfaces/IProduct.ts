export enum EProductTypeKey {
  CLOTHES = "clothes",
  ACCESSORIES = "accessories",
  DRINKS = "drinks",
  CANDIES = "candies",
  FOODS = "foods",
}

export interface IProductType {
  id: string;
  key: EProductTypeKey;
  name: string;
}
