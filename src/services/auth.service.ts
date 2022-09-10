import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";

import { User } from "../models/user";
import { ErrorHandler } from "../error";
import {
  IUserSignin,
  IUserSignup,
  IUser,
  IUserDataReturn,
} from "../interfaces/IUser";
import { userDataReturn } from "../utils/userDataReturn";

export class AuthService {
  static async signUp(userInput: IUserSignup): Promise<IUserDataReturn> {
    const emailExist = await User.findOne({ email: userInput.email });
    if (emailExist)
      throw new ErrorHandler(
        StatusCodes.BAD_REQUEST,
        "Correo electrónico ya registrado"
      );

    const salt = await bcrypt.genSalt(10);
    userInput.password = await bcrypt.hash(userInput.password, salt);

    const userDoc = await User.create(userInput);
    await userDoc.save();

    return userDataReturn(userDoc);
  }

  static async signIn(userData: IUserSignin): Promise<Omit<IUser, "password">> {
    // const userExist = await prisma.user.findUnique({
    //   where: { username: userData.username },
    // });

    // if (!userExist)
    //   throw new ErrorHandler(
    //     StatusCodes.UNAUTHORIZED,
    //     "Nombre de usuario o contraseña incorrectos"
    //   );

    // const passwordMatch = await bcrypt.compare(
    //   userData.password,
    //   userExist.password
    // );

    // if (!passwordMatch)
    //   throw new ErrorHandler(
    //     StatusCodes.UNAUTHORIZED,
    //     "Nombre de usuario o contraseña incorrectos"
    //   );

    // const {
    //   password,
    //   emailVerified_At,
    //   resetPassword,
    //   resetPasswordAt,
    //   ...user
    // } = userExist;

    // return user;
    return {
      uuid: "",
      email: "",
      name: "",
      photoUrl: "",
      emailVerified_At: null,
      phoneNumber: null,
      resetPassword: null,
      resetPasswordAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
