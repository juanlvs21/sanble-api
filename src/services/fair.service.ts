import dayjs from "dayjs";
import { ParamsDictionary } from "express-serve-static-core";
import { StatusCodes } from "http-status-codes";

import { ErrorHandler } from "../error";
import { IFair, IFairGeo } from "../interfaces/IFair";
import { IQueryListRequest } from "../interfaces/IRequest";
import { EReviewType, IReview } from "../interfaces/IReview";
import { IStand } from "../interfaces/IStand";
import { auth, db, OrderByDirection } from "../utils/firebase";
import { DEFAULT_LIMIT_VALUE } from "../utils/pagination";
import { fairDataFormat, fairDataFormatGeo } from "../utils/utilsFair";
import { standDataFormat } from "../utils/utilsStand";

export class FairService {
  static async getList({
    orderBy,
    orderDir,
    limit,
    lastIndex,
  }: IQueryListRequest) {
    const limitNumber = Number(limit) || 5;
    const firstIndexNumber = Number(lastIndex) || 0;

    let orderField = orderBy || "stars";
    let orderDirection: OrderByDirection = orderDir || "desc";

    let snapshot = await db
      .collection("fairs")
      .orderBy(orderField, orderDirection)
      .get();

    const fairs: IFair[] = [];

    snapshot.forEach((doc) => {
      fairs.push(fairDataFormat(doc.data() as IFair));
    });

    const lastIndexNew = firstIndexNumber + limitNumber;

    return {
      list: fairs.length ? fairs.slice(firstIndexNumber, lastIndexNew) : [],
      pagination: {
        total: snapshot.docs.length || 0,
        lastIndex: lastIndexNew,
        limit: limitNumber,
      },
    };
  }

  static async getBest() {
    const fairsDoc = await db
      .collection("fairs")
      .orderBy("stars", "desc")
      .limit(10)
      .get();

    const fairs: IFair[] = [];

    fairsDoc.forEach((doc) => fairs.push(fairDataFormat(doc.data() as IFair)));

    return fairs;
  }

  static async getDetails(params: ParamsDictionary) {
    const { fairID } = params;

    if (!fairID)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Feria no encontrada");

    const fairDoc = await db.collection("fairs").doc(fairID).get();

    if (!fairDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Feria no encontrada");

    return fairDataFormat(fairDoc.data() as IFair);
  }

  static async getGeolocationAll() {
    const fairsDoc = await db.collection("fairs").get();

    const fairs: IFairGeo[] = [];

    fairsDoc.forEach((doc) =>
      fairs.push(fairDataFormatGeo(doc.data() as IFairGeo))
    );

    return fairs;
  }

  static async getListReviews(
    uid: string,
    params: ParamsDictionary,
    { limit, lastIndex }: IQueryListRequest
  ) {
    const { fairID } = params;
    const limitNumber = Number(limit) || DEFAULT_LIMIT_VALUE;
    const firstIndexNumber = Number(lastIndex) || 0;

    const reviews: IReview[] = [];

    const snapshot = await db
      .collection("reviews")
      .orderBy("creationTime", "desc")
      .where("parent", "==", db.doc(`fairs/${fairID}`))
      .get();

    let reviewUserData = null;

    const reviewUserID = `${uid}-${fairID}`;

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

  static async getStands(
    params: ParamsDictionary,
    { limit, lastIndex }: IQueryListRequest
  ) {
    const { fairID } = params;
    const limitNumber = Number(limit) || DEFAULT_LIMIT_VALUE;
    const firstIndexNumber = Number(lastIndex) || 0;

    if (!fairID)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Feria no encontrada");

    const fairDoc = await db.collection("fairs").doc(fairID).get();

    if (!fairDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Feria no encontrada");

    const stands: IStand[] = [];
    const fairStandsIDs = (fairDoc.data() as IFair).stands.map(
      (stand) => stand.id
    );

    const snapshot = await db
      .collection("stands")
      .where("id", "in", fairStandsIDs)
      .get();

    snapshot.forEach((doc) => {
      stands.push(standDataFormat(doc.data() as IStand));
    });

    const lastIndexNew = firstIndexNumber + limitNumber;

    return {
      list: stands.length ? stands.slice(firstIndexNumber, lastIndexNew) : [],
      pagination: {
        total: stands.length || 0,
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
    const { fairID } = params;
    const { stars, comment } = body;
    const reviewType = EReviewType.FAIR;

    const userAuth = await auth.getUser(uid);

    const fairDoc = await db.collection("fairs").doc(fairID).get();

    if (!fairDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Feria no encontrada");

    const reviewID = `${userAuth.uid}-${fairID}`;

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
        parent: db.doc(`fairs/${fairID}`),
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
      .where("parent", "==", db.doc(`fairs/${fairID}`))
      .get();

    let reviewsCount = 0;
    let reviewsStars = 0;

    snapshotReviews.forEach((doc) => {
      reviewsCount++;
      reviewsStars = reviewsStars + doc.data().stars;
    });

    const fairNewStars = reviewsStars / reviewsCount;

    await db.collection("fairs").doc(fairID).update({ stars: fairNewStars });

    return {
      review: {
        ...reviewDoc.data(),
        ...reviewData,
      },
      fairStars: fairNewStars,
    };
  }
}
