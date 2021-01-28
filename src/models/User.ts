import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

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
      required: true,
      default:
        "https://firebasestorage.googleapis.com/v0/b/sanble-app.appspot.com/o/accounts%2Fprofile.png?alt=media&token=b19a5e07-6651-4639-a1d6-5ba60f12c16a",
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    admin: {
      type: Boolean,
      default: false,
    },
    email_verified_at: {
      type: Date,
      default: null,
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
