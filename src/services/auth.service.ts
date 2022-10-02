import { StatusCodes } from "http-status-codes";

import { ErrorHandler } from "../error";
import {
  auth,
  // db
} from "../utils/firebase";
import { userDataReturn, checkUserInFirebase } from "../utils/userUtils";
import { sendEmail } from "../mail/sendgrid";
import { welcomeTemplate } from "../mail/templates/welcome";
import { IUserSignup, IUser, IUserSignupExternal } from "../interfaces/IUser";

const welcomeEmailFrom = "Sanble <bienvenido@sanble.juanl.dev>";

export class AuthService {
  static async signUp(userInput: IUserSignup): Promise<IUser> {
    const { name, email, password } = userInput;
    const { user: emailExist } = await checkUserInFirebase(email);

    if (emailExist)
      throw new ErrorHandler(
        StatusCodes.BAD_REQUEST,
        "Correo electrónico ya registrado"
      );

    const userDoc = await auth.createUser({
      email,
      password,
      displayName: name,
      emailVerified: false,
      // photoURL: defaultImage,
    });

    // const userVerifyToken = userVerifyGenerateToken(userDoc.uid);

    // db.collection("userVerifyTokens").add(userVerifyToken);

    sendEmail(
      email,
      "¡Bienvenido a Sanble!",
      welcomeTemplate(
        name,
        `https://sanble.juanl.dev`
        // `https://sanble.juanl.dev/auth/verify?token=${userVerifyToken.token}`
      ),
      welcomeEmailFrom
    );

    return userDataReturn(userDoc);
  }

  static async signUpExternal(userInput: IUserSignupExternal): Promise<IUser> {
    const { email } = userInput;
    const user = await auth.getUserByEmail(email);

    if (!user)
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, "Usuario no encontrado");

    // sendEmail(
    //   email,
    //   "¡Bienvenido a Sanble!",
    //   welcomeTemplate(user.displayName || ""),
    //   welcomeEmailFrom
    // );

    return userDataReturn(user);
  }

  // static async signIn(userInput: IUserSignin): Promise<IUser> {
  //   const { email, password } = userInput;
  //   const user = await auth.getUserByEmail(email);

  //   if (!user)
  //     throw new ErrorHandler(
  //       StatusCodes.UNAUTHORIZED,
  //       "Nombre de usuario o contraseña incorrectos"
  //     );

  //   return userDataReturn(user);
  // }
}
