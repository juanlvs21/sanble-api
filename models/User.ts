import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

// Interfaces
import IUser from "../interfaces/IUser";

const UserSchema: Schema<IUser> = new Schema<IUser>(
  {
    uuid: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    url_avatar: {
      type: String,
      default: null,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    is_admin: {
      type: Boolean,
      default: false,
    },
    email_verified_at: {
      type: Date,
      default: null,
    },
    token_email_verified: {
      type: String,
      default: null,
      required: true,
    },
    password_reset: {
      type: Object,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Methods
UserSchema.methods.encryptPassword = async function (password: string) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(password, salt);
};

UserSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

export default model<IUser>("User", UserSchema);
