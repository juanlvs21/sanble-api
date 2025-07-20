export enum ENotificationType {
  FAIR_NEW = "FAIR_NEW",
  FAIR_POST = "FAIR_POST",
  FAIR_PHOTO = "FAIR_PHOTO",
  STAND_NEW = "STAND_NEW",
  STAND_POST = "STAND_POST",
  STAND_PHOTO = "STAND_PHOTO",
  STAND_PRODUCT = "STAND_PRODUCT",
  INVITATION_RECEIVED = "INVITATION_RECEIVED",
  REQUEST_RECEIVED = "REQUEST_RECEIVED",
  INVITATION_ACCEPTED = "INVITATION_ACCEPTED",
  FAIR_STAND_REMOVED = "FAIR_STAND_REMOVED",
  STAND_FAIR_REMOVED = "STAND_FAIR_REMOVED",
}

export enum ENotificationType {
  ENTREPRENEURSHIP = "entrepreneurship",
  GASTRONOMIC = "gastronomic",
}

export interface INotificationToken {
  token: string;
  deviceID: string;
}

export interface ISendNotification {
  title: string;
  body: string;
  uid?: string;
  imageUrl?: string | null;
  data: {
    type: ENotificationType;
    [key: string]: any;
  };
}
