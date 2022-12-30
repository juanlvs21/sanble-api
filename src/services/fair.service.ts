import { ParamsDictionary } from "express-serve-static-core";
import { StatusCodes } from "http-status-codes";

import { ErrorHandler } from "../error";
import { IFair, IFairGeo } from "../interfaces/IFair";
import { IQueryListRequest } from "../interfaces/IRequest";
import { EReviewType, IReview } from "../interfaces/IReview";
import { auth, db, OrderByDirection } from "../utils/firebase";
import { fairDataFormat, fairDataFormatGeo } from "../utils/utilsFair";

export class FairService {
  static async getList({
    page,
    perPage,
    orderBy,
    orderDir,
  }: IQueryListRequest) {
    const pageNumber = Number(page) || 1;
    const perPageNumber = Number(perPage) || 5;

    const fairsPages: IFair[][] = [[]];

    let orderField = orderBy || "stars";
    let orderDirection: OrderByDirection = orderDir || "desc";

    let snapshot = await db
      .collection("fairs")
      .orderBy(orderField, orderDirection)
      .get();

    let arrayPos = 0;

    snapshot.forEach((doc) => {
      fairsPages[arrayPos].push(fairDataFormat(doc.data() as IFair));

      if (fairsPages[arrayPos].length === perPageNumber) {
        fairsPages.push([]);
        arrayPos++;
      }
    });

    if (pageNumber > fairsPages.length) {
      throw new ErrorHandler(
        StatusCodes.UNPROCESSABLE_ENTITY,
        `La página ${pageNumber} no existe`
      );
    }

    return {
      list: fairsPages.length ? fairsPages[pageNumber - 1] : [],
      pagination: {
        total: snapshot.docs.length || 0,
        totalPages: fairsPages.length,
        page: pageNumber,
        perPage: perPageNumber,
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
  static async saveReview(
    uid: string,
    params: ParamsDictionary,
    body: Pick<IReview, "comment" | "stars">
  ) {
    const { fairID } = params;
    const { stars, comment } = body;
    const reviewType = EReviewType.FAIR;

    const userAuth = await auth.getUser(uid);

    if (!userAuth)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Usuario no encontrado");

    const fairDoc = await db.collection("fairs").doc(fairID).get();

    if (!fairDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Feria no encontrada");

    const reviewID = `${userAuth.uid}-${fairID}`;

    const reviewDocData: IReview = {
      id: reviewID,
      comment: comment,
      stars: stars,
      type: reviewType,
      ownerName: userAuth.displayName || "",
      ownerPhoto: userAuth.photoURL || "",
      owner: db.doc(`user/${userAuth.uid}`),
      parent: db.doc(`fairs/${fairID}`),
    };

    await db
      .collection("reviews")
      .doc(reviewID)
      .set(reviewDocData, { merge: true });

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
      review: reviewDocData,
      fair: {
        ...fairDataFormat(fairDoc.data() as IFair),
        stars: fairNewStars,
      },
    };
  }
}
