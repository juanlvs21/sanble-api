import randomstring from "randomstring";
import { UserRecord } from "firebase-admin/auth";

import { dayjs } from "./time";
import { auth } from "./firebase";
import { IUser, IUserVerifyToken } from "../interfaces/IUser";

interface ICheckUserReturn {
  isError: boolean;
  doesExist?: boolean;
  user?: UserRecord;
  err?: any;
}

export async function checkUserInFirebase(
  email: string
): Promise<ICheckUserReturn> {
  return new Promise((resolve) => {
    auth
      .getUserByEmail(email)
      .then((user) => {
        resolve({ isError: false, doesExist: true, user });
      })
      .catch((err) => {
        resolve({ isError: true, err });
      });
  });
}

export const userDataReturn = (user: UserRecord): IUser => {
  return {
    uid: user.uid,
    email: user.email || "",
    emailVerified: user.emailVerified,
    displayName: user.displayName || "",
    photoURL: user.photoURL || "",
    phoneNumber: user.phoneNumber || "",
    disabled: user.disabled,
    metadata: user.metadata,
  };
};

export function userVerifyGenerateToken(uid: string): IUserVerifyToken {
  return {
    uid,
    expiresIn: dayjs().add(24, "hours").toDate(),
    token: randomstring.generate(40) + dayjs().unix(),
  };
}
