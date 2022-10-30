import { StatusCodes } from "http-status-codes";

import { ErrorHandler } from "../error";
import {
  IUser,
  IUserAuth,
  IUserData,
  IUserFavorites,
  IUserFavoritesBody,
  IUserSignup,
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
      favoriteFairs: [],
      favoriteStands: [],
      favoriteProducts: [],
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

  static async getProfile(uid: string): Promise<IUser> {
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

  static async setFavoriteFair(
    uid: string,
    body: IUserFavoritesBody
  ): Promise<IUserFavorites> {
    const { favoriteID } = body;
    const userAuth = await auth.getUser(uid);

    if (!userAuth)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Usuario no encontrado");

    const userDataDoc = await db.collection("users").doc(userAuth.uid).get();

    if (!userDataDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Usuario no encontrado");

    const fairID = favoriteID || "";

    const standDataDoc = await db.collection("fairs").doc(fairID).get();

    if (!standDataDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Feria no encontrado");

    const userData = userDataDoc.data();

    let favorites: string[] = userData?.favoriteFairs;

    if (favorites.includes(fairID)) {
      favorites = favorites.filter((fav) => fav !== favoriteID);
    } else {
      favorites.push(fairID);
    }

    await db.collection("users").doc(userAuth.uid).update({
      favoriteFairs: favorites,
    });

    return { favorites };
  }

  static async setFavoriteStand(
    uid: string,
    body: IUserFavoritesBody
  ): Promise<IUserFavorites> {
    const { favoriteID } = body;
    const userAuth = await auth.getUser(uid);

    if (!userAuth)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Usuario no encontrado");

    const userDataDoc = await db.collection("users").doc(userAuth.uid).get();

    if (!userDataDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Usuario no encontrado");

    const productID = favoriteID || "";

    const standDataDoc = await db.collection("stands").doc(productID).get();

    if (!standDataDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Stand no encontrado");

    const userData = userDataDoc.data();

    let favorites: string[] = userData?.favoriteStands;

    if (favorites.includes(productID)) {
      favorites = favorites.filter((fav) => fav !== favoriteID);
    } else {
      favorites.push(productID);
    }

    await db.collection("users").doc(userAuth.uid).update({
      favoriteStands: favorites,
    });

    return { favorites };
  }

  static async setFavoriteProduct(
    uid: string,
    body: IUserFavoritesBody
  ): Promise<IUserFavorites> {
    const { favoriteID } = body;
    const userAuth = await auth.getUser(uid);

    if (!userAuth)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Usuario no encontrado");

    const userDataDoc = await db.collection("users").doc(userAuth.uid).get();

    if (!userDataDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Usuario no encontrado");

    const productID = favoriteID || "";

    const standDataDoc = await db.collection("products").doc(productID).get();

    if (!standDataDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Producto no encontrado");

    const userData = userDataDoc.data();

    let favorites: string[] = userData?.favoriteProducts;

    if (favorites.includes(productID)) {
      favorites = favorites.filter((fav) => fav !== favoriteID);
    } else {
      favorites.push(productID);
    }

    await db.collection("users").doc(userAuth.uid).update({
      favoriteProducts: favorites,
    });

    return { favorites };
  }
}
