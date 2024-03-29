import { UserInfo, UserMetadata } from "firebase-admin/auth";
import { DocumentReference, Timestamp } from "firebase-admin/firestore";
import { File } from "formidable";

import { IRefBasic } from "./IRef";

export interface IUserAuth {
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
  photoURL?: string;
  phoneNumber: string;
  disabled: boolean;
  metadata: UserMetadata;
  providerData: UserInfo[];
}

export interface IUserData {
  uid: string;
  isAdmin: boolean;
  creationTime: Timestamp;
  verifyTokens: IUserVerifyToken;
  favoriteFairs: string[];
  favoriteStands: string[];
  favoriteProducts: string[];
  ownerFairs: IRefBasic[] | DocumentReference[];
  ownerStands: IRefBasic[] | DocumentReference[];
}

export interface IUser extends IUserAuth, IUserData {}

export interface IUserVerifyToken {
  expiresIn: Date;
  token: string;
}

export interface IUserSignup {
  name: string;
  email: string;
  password: string;
}

export interface IUserSignin {
  email: string;
  password: string;
}

export interface IUserFavoritesBody {
  favoriteID?: string;
}

export interface IUserUpdate {
  email: string;
  displayName: string;
  phoneNumber?: string;
}

export interface IUserPhoto {
  files: File[];
}

export interface IUserChangePassword {
  password: string;
}

export interface IUserRecoveryPassword {
  email: string;
}

export interface IUserOwnerData {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}
