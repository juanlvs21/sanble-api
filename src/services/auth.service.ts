import e from "express";
import { StatusCodes } from "http-status-codes";

import { ErrorHandler } from "../error";
import {
  IUser,
  IUserAuth,
  IUserData,
  IUserSignup,
  IUsersignInExternal,
} from "../interfaces/IUser";
import { sendEmail } from "../mail/sendgrid";
import { welcomeTemplate } from "../mail/templates/welcome";
import { auth, db, Timestamp } from "../utils/firebase";
import {
  checkUserInFirebase,
  userAuthReturn,
  userVerifyGenerateToken,
} from "../utils/utilsUser";

const welcomeEmailFrom = "Sanble <bienvenido@sanble.juanl.dev>";
const welcomeEmailSubject = "¡Bienvenido a Sanble!";

export class AuthService {
  static async signUp(userInput: IUserSignup): Promise<IUserAuth> {
    const { name, email, password } = userInput;
    const { user: emailExist } = await checkUserInFirebase(email);

    if (emailExist)
      throw new ErrorHandler(
        StatusCodes.BAD_REQUEST,
        "Correo electrónico ya registrado"
      );

    const userAuth = await auth.createUser({
      email,
      password,
      displayName: name,
      emailVerified: false,
    });

    const userDocData: IUserData = {
      uid: userAuth.uid,
      creationTime: Timestamp.fromDate(new Date()),
      verifyTokens: userVerifyGenerateToken(),
      isAdmin: false,
    };
    await db.collection("users").doc(userAuth.uid).set(userDocData);

    sendEmail(
      email,
      welcomeEmailSubject,
      welcomeTemplate(
        name,
        `https://sanble.juanl.dev`
        // `https://sanble.juanl.dev/auth/verify?token=${userVerifyToken.token}`
      ),
      welcomeEmailFrom
    );

    return userAuthReturn(userAuth, userDocData);
  }

  static async signInExternal(
    userInput: IUsersignInExternal
  ): Promise<IUserAuth> {
    const { email } = userInput;
    const userAuth = await auth.getUserByEmail(email);

    if (!userAuth)
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, "Usuario no encontrado");

    const userDocData: IUserData = {
      uid: userAuth.uid,
      creationTime: Timestamp.fromDate(new Date()),
      verifyTokens: userVerifyGenerateToken(),
      isAdmin: false,
    };

    const usecDocExist = await db.collection("users").doc(userAuth.uid).get();

    if (usecDocExist) {
      return userAuthReturn(userAuth, userDocData);
    } else {
      await db.collection("users").doc(userAuth.uid).set(userDocData);

      sendEmail(
        email,
        welcomeEmailSubject,
        welcomeTemplate(userAuth.displayName || ""),
        welcomeEmailFrom
      );

      return userAuthReturn(userAuth, userDocData);
    }
  }

  static async getUserData(uid: string): Promise<IUser> {
    const userAuth = await auth.getUser(uid);
    const userDataDoc = await db.collection("users").doc(uid).get();
    const userData = userDataDoc.data();

    if (!userAuth)
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, "Usuario no existe");

    const userDocData: IUserData = {
      uid: userAuth.uid,
      isAdmin: userData?.userData || false,
      creationTime: userData?.creationTime,
      verifyTokens: userData?.verifyTokens,
    };

    return userAuthReturn(userAuth, userDocData);
  }
}
