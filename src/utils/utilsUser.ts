import { UserRecord } from "firebase-admin/auth";
import randomstring from "randomstring";

import { IUser, IUserData, IUserVerifyToken } from "../interfaces/IUser";
import { auth } from "./firebase";
import { dayjs } from "./time";

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

export const userAuthReturn = (
  userAuth: UserRecord,
  userDoc: IUserData
): IUser => {
  return {
    uid: userAuth.uid,
    displayName: userAuth.displayName || "",
    email: userAuth.email || "",
    emailVerified: userAuth.emailVerified,
    phoneNumber: userAuth.phoneNumber || "",
    photoURL: userAuth.photoURL || undefined,
    providerData: userAuth.providerData,
    disabled: userAuth.disabled,
    metadata: userAuth.metadata,
    isAdmin: userDoc.isAdmin || false,
    creationTime: userDoc.creationTime,
    verifyTokens: userDoc.verifyTokens,
    favoriteStands: userDoc.favoriteStands,
    favoriteProducts: userDoc.favoriteProducts,
    favoriteFairs: userDoc.favoriteFairs,
  };
};

export function userVerifyGenerateToken(): IUserVerifyToken {
  return {
    expiresIn: dayjs().add(24, "hours").toDate(),
    token: randomstring.generate(40) + dayjs().unix(),
  };
}
