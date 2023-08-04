import { StatusCodes } from "http-status-codes";

import { ErrorHandler } from "../error";
import {
  IUserChangePassword,
  IUserData,
  IUserRecoveryPassword,
  IUserSignup,
  IUserUpdate,
} from "../interfaces/IUser";
import { sendEmail } from "../mail/sendgrid";
import { welcomeTemplate } from "../mail/templates/welcome";
import { auth, db, Timestamp } from "../utils/firebase";
import {
  checkUserInFirebase,
  userAuthReturn,
  userVerifyGenerateToken,
} from "../utils/utilsUser";
import { recoveryTemplate } from "../mail/templates/recovery";

const welcomeEmailFrom = "Sanble <bienvenido@sanble.juanl.dev>";
const welcomeEmailSubject = "¡Bienvenido a Sanble!";

export class UserService {
  static async signUp(userInput: IUserSignup) {
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
      favoriteFairs: [],
      favoriteStands: [],
      favoriteProducts: [],
      ownerFairs: [],
      ownerStands: [],
    };
    await db.collection("users").doc(userAuth.uid).set(userDocData);

    const verifyEmailLink = await auth.generateEmailVerificationLink(email);

    sendEmail(
      email,
      welcomeEmailSubject,
      welcomeTemplate(name, verifyEmailLink),
      welcomeEmailFrom
    );

    return userAuthReturn(userAuth, userDocData);
  }

  static async getProfile(uid: string) {
    const userAuth = await auth.getUser(uid);

    if (!userAuth)
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, "Usuario no existe");

    const userDataDoc = await db.collection("users").doc(userAuth.uid).get();

    if (userDataDoc.exists) {
      const userData = userDataDoc.data();

      const userDocData: IUserData = {
        uid: userAuth.uid,
        isAdmin: userData?.userData || false,
        creationTime: userData?.creationTime,
        verifyTokens: userData?.verifyTokens,
        favoriteFairs: userData?.favoriteFairs,
        favoriteStands: userData?.favoriteStands,
        favoriteProducts: userData?.favoriteProducts,
        ownerFairs: userData?.ownerFairs,
        ownerStands: userData?.ownerStands,
      };

      return userAuthReturn(userAuth, userDocData);
    } else {
      const userDocData: IUserData = {
        uid: userAuth.uid,
        creationTime: Timestamp.fromDate(new Date()),
        verifyTokens: userVerifyGenerateToken(),
        isAdmin: false,
        favoriteFairs: [],
        favoriteStands: [],
        favoriteProducts: [],
        ownerFairs: [],
        ownerStands: [],
      };

      await db.collection("users").doc(userAuth.uid).set(userDocData);

      sendEmail(
        userAuth?.email ?? "",
        welcomeEmailSubject,
        welcomeTemplate(userAuth.displayName || ""),
        welcomeEmailFrom
      );

      return userAuthReturn(userAuth, userDocData);
    }
  }

  static async updateUser(uid: string, userInput: IUserUpdate) {
    const { email, displayName, phoneNumber } = userInput;
    const userAuth = await auth.getUser(uid);

    if (!userAuth)
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, "Usuario no existe");

    const userDataDoc = await db.collection("users").doc(userAuth.uid).get();

    if (!userDataDoc.exists)
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, "Usuario no existe");

    const userData = userDataDoc.data();

    const userDocData: IUserData = {
      uid: userAuth.uid,
      isAdmin: userData?.userData || false,
      creationTime: userData?.creationTime,
      verifyTokens: userData?.verifyTokens,
      favoriteFairs: userData?.favoriteFairs,
      favoriteStands: userData?.favoriteStands,
      favoriteProducts: userData?.favoriteProducts,
      ownerFairs: userData?.ownerFairs,
      ownerStands: userData?.ownerStands,
    };

    let newInput: IUserUpdate = { displayName, email };

    if (phoneNumber) newInput.phoneNumber = phoneNumber;

    const newUser = await auth.updateUser(uid, newInput);

    return userAuthReturn(newUser, userDocData);
  }

  static async changePassword(uid: string, passwordInput: IUserChangePassword) {
    const userAuth = await auth.getUser(uid);

    if (!userAuth)
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, "Usuario no existe");

    const userDataDoc = await db.collection("users").doc(userAuth.uid).get();

    if (!userDataDoc.exists)
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, "Usuario no existe");

    await auth.updateUser(uid, passwordInput);
  }

  static async recoveryPassword(passwordInput: IUserRecoveryPassword) {
    const { email } = passwordInput;
    const userAuth = await auth.getUserByEmail(email);

    if (!userAuth)
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, "Usuario no existe");

    const verifyEmailLink = await auth.generatePasswordResetLink(email);

    sendEmail(
      userAuth?.email ?? "",
      "Recuperar contraseña",
      recoveryTemplate(userAuth?.displayName ?? "", verifyEmailLink),
      "Sanble <soporte@sanble.juanl.dev>"
    );
  }
}
