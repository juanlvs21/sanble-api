import { StatusCodes } from "http-status-codes";

import { ErrorHandler } from "../error";
import { IFair } from "../interfaces/IFair";
import { IQueryListRequest } from "../interfaces/IRequest";
import { IUserFavoritesBody } from "../interfaces/IUser";
import { OrderByDirection, auth, db } from "../utils/firebase";
import { fairDataFormat } from "../utils/utilsFair";
import { DEFAULT_LIMIT_VALUE } from "../utils/pagination";
import { IStand } from "../interfaces/IStand";
import { standDataFormat } from "../utils/utilsStand";

export class FavoriteService {
  static async getFavoriteFair(
    { orderBy, orderDir, limit, lastIndex }: IQueryListRequest,
    uid: string
  ) {
    const limitNumber = Number(limit) || DEFAULT_LIMIT_VALUE;
    const firstIndexNumber = Number(lastIndex) || 0;

    const orderField = orderBy || "stars";
    const orderDirection: OrderByDirection = orderDir || "desc";

    const userAuth = await auth.getUser(uid);

    if (!userAuth)
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, "Usuario no existe");

    const userDataDoc = await db.collection("users").doc(userAuth.uid).get();

    if (!userDataDoc.exists)
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, "Usuario no existe");

    const fairs: IFair[] = [];
    let totalRecords = 0;

    if (userDataDoc.data()?.favoriteFairs?.length > 0) {
      const snapshot = await db
        .collection("fairs")
        .orderBy(orderField, orderDirection)
        .where("id", "in", userDataDoc.data()?.favoriteFairs ?? [])
        .get();

      snapshot.forEach((doc) => {
        fairs.push(fairDataFormat(doc.data() as IFair));
      });

      totalRecords = snapshot.docs.length;
    }

    const list = fairs.length
      ? fairs.slice(firstIndexNumber, firstIndexNumber + limitNumber)
      : [];

    return {
      list,
      pagination: {
        total: totalRecords,
        lastIndex: firstIndexNumber + list.length,
        limit: limitNumber,
      },
      order: {
        orderBy,
        orderDir,
      },
    };
  }

  static async getFavoriteStand(
    { orderBy, orderDir, limit, lastIndex }: IQueryListRequest,
    uid: string
  ) {
    const limitNumber = Number(limit) || DEFAULT_LIMIT_VALUE;
    const firstIndexNumber = Number(lastIndex) || 0;

    const orderField = orderBy || "stars";
    const orderDirection: OrderByDirection = orderDir || "desc";

    const userAuth = await auth.getUser(uid);

    if (!userAuth)
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, "Usuario no existe");

    const userDataDoc = await db.collection("users").doc(userAuth.uid).get();

    if (!userDataDoc.exists)
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, "Usuario no existe");

    const stands: IStand[] = [];
    let totalRecords = 0;

    if (userDataDoc.data()?.favoriteStands.length > 0) {
      const snapshot = await db
        .collection("stands")
        .orderBy(orderField, orderDirection)
        .where("id", "in", userDataDoc.data()?.favoriteStands ?? [])
        .get();

      snapshot.forEach((doc) => {
        stands.push(standDataFormat(doc.data() as IStand));
      });

      totalRecords = snapshot.docs.length;
    }

    const list = stands.length
      ? stands.slice(firstIndexNumber, firstIndexNumber + limitNumber)
      : [];

    return {
      list,
      pagination: {
        total: totalRecords,
        lastIndex: firstIndexNumber + list.length,
        limit: limitNumber,
      },
      order: {
        orderBy,
        orderDir,
      },
    };
  }

  static async setFavoriteFair(uid: string, body: IUserFavoritesBody) {
    const { favoriteID } = body;

    const userDataDoc = await db.collection("users").doc(uid).get();

    if (!userDataDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Usuario no encontrado");

    const fairID = favoriteID || "";

    const fairDataDoc = await db.collection("fairs").doc(fairID).get();

    if (!fairDataDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Feria no encontrada");

    const userData = userDataDoc.data();

    let favorites: string[] = userData?.favoriteFairs;

    if (favorites.includes(fairID)) {
      favorites = favorites.filter((fav) => fav !== favoriteID);
    } else {
      favorites.push(fairID);
    }

    await db.collection("users").doc(uid).update({
      favoriteFairs: favorites,
    });

    return { favorites };
  }

  static async setFavoriteStand(uid: string, body: IUserFavoritesBody) {
    const { favoriteID } = body;
    const userDataDoc = await db.collection("users").doc(uid).get();

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

    await db.collection("users").doc(uid).update({
      favoriteStands: favorites,
    });

    return { favorites };
  }

  static async setFavoriteProduct(uid: string, body: IUserFavoritesBody) {
    const { favoriteID } = body;

    const userDataDoc = await db.collection("users").doc(uid).get();

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

    await db.collection("users").doc(uid).update({
      favoriteProducts: favorites,
    });

    return { favorites };
  }
}
