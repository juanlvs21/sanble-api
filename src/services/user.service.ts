import { PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";

import { ErrorHandler } from "../error";
import { TUserLogin, TUserSignup } from "../types/TUser";

const prisma = new PrismaClient();

export class UserService {
  static async signUp(userData: TUserSignup) {
    const emailExist = await prisma.user.findUnique({
      where: { email: userData.email },
    });
    if (emailExist)
      throw new ErrorHandler(
        StatusCodes.BAD_REQUEST,
        "Correo electrónico ya registrado"
      );

    const usernameExist = await prisma.user.findUnique({
      where: { username: userData.username },
    });
    if (usernameExist)
      throw new ErrorHandler(
        StatusCodes.BAD_REQUEST,
        "Nombre de usuario ya registrado"
      );

    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);

    const userCreated = await prisma.user.create({
      data: userData,
    });

    const {
      password,
      emailVerified_At,
      resetPassword,
      resetPasswordAt,
      ...user
    } = userCreated;

    return user;
  }

  static async logIn(userData: TUserLogin) {
    const userExist = await prisma.user.findUnique({
      where: { username: userData.username },
    });

    if (!userExist)
      throw new ErrorHandler(
        StatusCodes.UNAUTHORIZED,
        "Nombre de usuario o contraseña incorrectos"
      );

    const passwordMatch = await bcrypt.compare(
      userData.password,
      userExist.password
    );

    if (!passwordMatch)
      throw new ErrorHandler(
        StatusCodes.UNAUTHORIZED,
        "Nombre de usuario o contraseña incorrectos"
      );

    const {
      password,
      emailVerified_At,
      resetPassword,
      resetPasswordAt,
      ...user
    } = userExist;

    return user;
  }
}
