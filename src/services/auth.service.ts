import { StatusCodes } from "http-status-codes";

import { User } from "../models/user";
import { ErrorHandler } from "../error";
import { IUserSignin, IUserSignup, IUserDataReturn } from "../interfaces/IUser";
import { userDataReturn } from "../utils/userDataReturn";
import { sendEmail } from "../mail/sendgrid";
import { welcomeTemplate } from "../mail/templates/welcome";

export class AuthService {
  static async signUp(userInput: IUserSignup): Promise<IUserDataReturn> {
    const emailExist = await User.findOne({ email: userInput.email });

    if (emailExist)
      throw new ErrorHandler(
        StatusCodes.BAD_REQUEST,
        "Correo electrónico ya registrado"
      );

    const userDoc = await User.create(userInput);

    await userDoc.save();

    sendEmail(
      userDoc.email,
      "¡Bienvenido a Sanble!",
      welcomeTemplate(
        userDoc.name,
        `https://sanble.juanl.dev/auth/verify?token=${userDoc.emailVerified.token}`
      )
    );

    return userDataReturn(userDoc);
  }

  static async signIn(userInput: IUserSignin): Promise<IUserDataReturn> {
    const user = await User.findOne({ email: userInput.email });

    if (!user)
      throw new ErrorHandler(
        StatusCodes.UNAUTHORIZED,
        "Nombre de usuario o contraseña incorrectos"
      );

    const passwordMatch = await user.comparePassword(userInput.password);

    if (!passwordMatch)
      throw new ErrorHandler(
        StatusCodes.UNAUTHORIZED,
        "Nombre de usuario o contraseña incorrectos"
      );

    return userDataReturn(user);
  }
}
