import { StatusCodes } from "http-status-codes";

import { ErrorHandler } from "../error";
import {
  IUserChangePassword,
  IUserData,
  IUserFavoritesBody,
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

    sendEmail(
      email,
      welcomeEmailSubject,
      welcomeTemplate(
        name,
        `https://sanble.juanl.dev`
        // TODO: Make user verification work. Link:`https://sanble.juanl.dev/auth/verify?token=${userVerifyToken.token}`
      ),
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
        userAuth.email || "",
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

    const newData = await auth.updateUser(uid, userInput);

    return userAuthReturn(newData, userDocData);
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
    const userAuth = await auth.getUserByEmail(passwordInput?.email ?? "");

    if (!userAuth)
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, "Usuario no existe");

    await auth.generatePasswordResetLink(passwordInput.email);
  }
}
