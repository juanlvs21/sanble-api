import { StatusCodes } from "http-status-codes";

import { ParamsDictionary } from "express-serve-static-core";
import { ErrorHandler } from "../error";
import { IPhotographForm } from "../interfaces/IPhotograph";
import {
  IUserChangePassword,
  IUserData,
  IUserRecoveryPassword,
  IUserSignup,
  IUserUpdate,
} from "../interfaces/IUser";
import { sendEmail } from "../mail/sendgrid";
import { recoveryTemplate } from "../mail/templates/recovery";
import { welcomeTemplate } from "../mail/templates/welcome";
import { Timestamp, auth, db } from "../utils/firebase";
import {
  checkUserInFirebase,
  userAuthReturn,
  userVerifyGenerateToken,
  validPhotoUser,
} from "../utils/utilsUser";
import { uploadFile } from "../utils/imagekit";
import { EFolderName } from "../interfaces/IFile";

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
    const userAuth = await auth.getUser(uid);

    if (!userAuth)
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, "Usuario no existe");

    const userDataDoc = await db.collection("users").doc(userAuth.uid).get();

    if (!userDataDoc.exists)
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, "Usuario no existe");

    const userData = userDataDoc.data() as IUserData;

    const newUser = await auth.updateUser(uid, {
      ...userInput,
      phoneNumber: userInput?.phoneNumber
        ? `+58${userInput.phoneNumber}`
        : null,
    });

    return userAuthReturn(newUser, userData);
  }

  static async uploadPhotograph(uid: string, body: IPhotographForm) {
    const userAuth = await auth.getUser(uid);

    if (!userAuth)
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, "Usuario no existe");

    const userDataDoc = await db.collection("users").doc(userAuth.uid).get();

    if (!userDataDoc.exists)
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, "Usuario no existe");

    const userData = userDataDoc.data() as IUserData;

    const { url } = await uploadFile({
      file: body.files[0],
      mimetype: body.files[0].mimetype || "",
      folder: `${EFolderName.USERS}/${userAuth.uid}`,
    });

    const newUser = await auth.updateUser(uid, {
      photoURL: url,
    });

    return userAuthReturn(newUser, userData);
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
