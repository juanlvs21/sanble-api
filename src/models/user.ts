import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import { IUserDoc } from "../interfaces/IUser";
import { userVerifyGenerateToken } from "../utils/userVerifyAccount";

const userSchema = new Schema(
  {
    uuid: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      max: 40,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      max: 40,
    },
    password: {
      type: String,
      required: true,
    },
    emailVerified: {
      verifiedAt: {
        type: Date,
        default: null,
      },
      expiresIn: {
        type: Date,
        default: null,
      },
      token: {
        type: String,
        default: null,
      },
    },
    phoneNumber: {
      type: String,
      default: null,
      min: 10,
      max: 16,
    },
    photoUrl: {
      type: String,
      default: "https://ik.imagekit.io/sanble/avatar_SMHFRa-Afo.png",
    },
    resetPassword: {
      type: String,
      default: null,
    },
    resetPasswordAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre<IUserDoc>("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  user.uuid = uuidv4();
  user.emailVerified = userVerifyGenerateToken();

  next();
});

userSchema.methods.comparePassword = async function (
  password: string
): Promise<Boolean> {
  return await bcrypt.compare(password, this.password);
};

export const User = model<IUserDoc>("User", userSchema);
