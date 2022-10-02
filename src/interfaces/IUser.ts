import { UserMetadata } from "firebase-admin/auth";

export interface IUser {
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
  photoURL: string;
  phoneNumber: string;
  disabled: boolean;
  metadata: UserMetadata;
}

export interface IUserVerifyToken {
  uid: string;
  expiresIn: Date;
  token: string;
}

export interface IUserSignup {
  name: string;
  email: string;
  password: string;
}

export interface IUserSignupExternal {
  email: string;
}

export interface IUserSignin {
  email: string;
  password: string;
}
