import { model, Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  id?: string;
  username: string;
  email: string;
  password: string;
  name: string;
  disabled?: boolean;
  photoURL?: string;
  phoneNumber?: string;
  emailVerified?: boolean;
  comparePassword: (password: string) => Promise<Boolean>;
}

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      min: 0,
      max: 50,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      min: 0,
      max: 70,
    },
    photoURL: {
      type: String,
      default: "/static/default.png",
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre<IUser>("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;

  next();
});

userSchema.methods.comparePassword = async function (
  password: string
): Promise<Boolean> {
  return await bcrypt.compare(password, this.password);
};

userSchema.set("toJSON", {
  transform: (_, { password, ...user }: IUser) => {
    user.id = user._id;
    delete user._id;
    delete user.__v;
    return user;
  },
});

// userSchema.methods.toJSON = function() {
//   var obj = this.toObject();
//   delete obj.password;
//   return obj;
// }

export default model<IUser>("User", userSchema);
