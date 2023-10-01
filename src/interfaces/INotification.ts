export enum ENotificationType {
  FAIR_NEW = "FAIR_NEW",
  FAIR_POST = "FAIR_POST",
  FAIR_PHOTO = "FAIR_PHOTO",
  STAND_NEW = "STAND_NEW",
  STAND_POST = "STAND_POST",
  STAND_PHOTO = "STAND_PHOTO",
  STAND_PRODUCT = "STAND_PRODUCT",
}

export enum ENotificationType {
  ENTREPRENEURSHIP = "entrepreneurship",
  GASTRONOMIC = "gastronomic",
}

export interface INotificationToken {
  token: string;
  deviceID: string;
}
