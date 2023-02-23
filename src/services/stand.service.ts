import dayjs from "dayjs";
import { ParamsDictionary } from "express-serve-static-core";
import { StatusCodes } from "http-status-codes";

import { ErrorHandler } from "../error";
import { IQueryListRequest } from "../interfaces/IRequest";
import { EReviewType, IReview } from "../interfaces/IReview";
import { IStand } from "../interfaces/IStand";
import { auth, db, OrderByDirection } from "../utils/firebase";
import { DEFAULT_LIMIT_VALUE } from "../utils/pagination";
import { standDataFormat } from "../utils/utilsStand";

export class StandService {
  static async getList({
    orderBy,
    orderDir,
    limit,
    lastIndex,
  }: IQueryListRequest) {
    const limitNumber = Number(limit) || DEFAULT_LIMIT_VALUE;
    const firstIndexNumber = Number(lastIndex) || 0;

    const orderField = orderBy || "stars";
    const orderDirection: OrderByDirection = orderDir || "desc";

    const snapshot = await db
      .collection("stands")
      .orderBy(orderField, orderDirection)
      .get();

    const stands: IStand[] = [];

    snapshot.forEach((doc) => {
      stands.push(standDataFormat(doc.data() as IStand));
    });

    const lastIndexNew = firstIndexNumber + limitNumber;

    return {
      list: stands.length ? stands.slice(firstIndexNumber, lastIndexNew) : [],
      pagination: {
        total: snapshot.docs.length || 0,
        lastIndex: lastIndexNew,
        limit: limitNumber,
      },
    };
  }

  static async getBest() {
    const standsDoc = await db
      .collection("stands")
      .orderBy("stars", "desc")
      .limit(10)
      .get();

    const stands: IStand[] = [];

    standsDoc.forEach((doc) =>
      stands.push(standDataFormat(doc.data() as IStand))
    );

    return stands;
  }

  static async getDetails(params: ParamsDictionary) {
    const { standID } = params;

    if (!standID)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Stand no encontrado");

    const standDoc = await db.collection("stands").doc(standID).get();

    if (!standDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Stand no encontrado");

    return standDataFormat(standDoc.data() as IStand);
  }

  static async getListReviews(
    uid: string,
    params: ParamsDictionary,
    { limit, lastIndex }: IQueryListRequest
  ) {
    const { standID } = params;
    const limitNumber = Number(limit) || DEFAULT_LIMIT_VALUE;
    const firstIndexNumber = Number(lastIndex) || 0;

    const reviews: IReview[] = [];

    const snapshot = await db
      .collection("reviews")
      .orderBy("creationTime", "desc")
      .where("parent", "==", db.doc(`stands/${standID}`))
      .get();

    let reviewUserData = null;

    const reviewUserID = `${uid}-${standID}`;

    snapshot.forEach((doc) => {
      reviews.push(doc.data() as IReview);

      if (doc.data().id === reviewUserID) reviewUserData = doc.data();
    });

    const lastIndexNew = firstIndexNumber + limitNumber;

    return {
      form: reviewUserData,
      list: reviews.length ? reviews.slice(firstIndexNumber, lastIndexNew) : [],
      pagination: {
        total: snapshot.docs.length || 0,
        lastIndex: lastIndexNew,
        limit: limitNumber,
      },
    };
  }

  static async saveReview(
    uid: string,
    params: ParamsDictionary,
    body: Pick<IReview, "comment" | "stars">
  ) {
    const { standID } = params;
    const { stars, comment } = body;
    const reviewType = EReviewType.STAND;

    const userAuth = await auth.getUser(uid);

    const standDoc = await db.collection("stands").doc(standID).get();

    if (!standDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Stand no encontrado");

    const reviewID = `${userAuth.uid}-${standID}`;

    const reviewDoc = await db.collection("reviews").doc(reviewID).get();

    let reviewData = {};

    if (reviewDoc.exists) {
      reviewData = {
        comment: comment,
        stars: stars,
        ownerName: userAuth.displayName || "",
        ownerPhoto: userAuth.photoURL || "",
        updateTime: dayjs().format(),
      };
    } else {
      const time = dayjs().format();
      reviewData = {
        id: reviewID,
        comment: comment,
        stars: stars,
        type: reviewType,
        ownerName: userAuth.displayName || "",
        ownerPhoto: userAuth.photoURL || "",
        owner: db.doc(`user/${userAuth.uid}`),
        parent: db.doc(`stands/${standID}`),
        creationTime: time,
        updateTime: time,
      };
    }

    await db
      .collection("reviews")
      .doc(reviewID)
      .set(reviewData, { merge: true });

    const snapshotReviews = await db
      .collection("reviews")
      .where("parent", "==", db.doc(`stands/${standID}`))
      .get();

    let reviewsCount = 0;
    let reviewsStars = 0;

    snapshotReviews.forEach((doc) => {
      reviewsCount++;
      reviewsStars = reviewsStars + doc.data().stars;
    });

    const standNewStars = reviewsStars / reviewsCount;

    await db.collection("stands").doc(standID).update({ stars: standNewStars });

    return {
      review: {
        ...reviewDoc.data(),
        ...reviewData,
      },
      standStars: standNewStars,
    };
  }
}
