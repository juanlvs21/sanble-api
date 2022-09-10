import { Document } from "mongoose";

export interface IUser {
  uuid: string;
  email: string;
  name: string;
  password: string;
  emailVerified_At: Date | null;
  phoneNumber: string | null;
  photoUrl: string;
  resetPassword: string | null;
  resetPasswordAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDoc extends Document, IUser {
  comparePassword?: (password: string) => Promise<Boolean>;
}

export interface IUserSignup {
  name: string;
  email: string;
  password: string;
}

export interface IUserSignin {
  username: string;
  password: string;
}

export interface IUserDataReturn {
  uuid: string;
  email: string;
  name: string;
  photoUrl: string;
  phoneNumber: string | null;
  emailVerified_At: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
