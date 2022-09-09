import { Document } from "mongoose";

export interface IUser {
  uuid: string
  email: string
  name: string
  password: string
  emailVerified_At?: Date
  phoneNumber?: string
  photoUrl: string
  resetPassword?: string
  resetPasswordAt?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface IUserDoc extends Document, IUser {
  comparePassword?: (password: string) => Promise<Boolean>;
}

export interface IUserSignup {
  name: string;
  email: string;
  password: string;
};

export interface IUserSignin {
  username: string;
  password: string;
};