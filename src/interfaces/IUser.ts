import { UserInfo, UserMetadata } from "firebase-admin/auth";
import { Timestamp } from "firebase-admin/firestore";

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
