import { IUser, IUserDataReturn } from "../interfaces/IUser";

export const userDataReturn = (user: IUser): IUserDataReturn => {
  return {
    uuid: user.uuid,
    email: user.email,
    name: user.name,
    photoUrl: user.photoUrl,
    phoneNumber: user.phoneNumber,
    emailVerifiedAt: user.emailVerified.verifiedAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
