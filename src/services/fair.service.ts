import dayjs from "dayjs";
import { ParamsDictionary } from "express-serve-static-core";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";

import { ErrorHandler } from "../error";
import { IFair, IFairForm, IFairGeo } from "../interfaces/IFair";
import { EFolderName } from "../interfaces/IFile";
import { IPhotograph, IPhotographForm } from "../interfaces/IPhotograph";
import { IPost, IPostForm } from "../interfaces/IPost";
import { IQueryListRequest } from "../interfaces/IRequest";
import { IReview } from "../interfaces/IReview";
import { IStand } from "../interfaces/IStand";
import { IUser } from "../interfaces/IUser";
import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  OrderByDirection,
  Timestamp,
  auth,
  db,
} from "../utils/firebase";
import { deleteFile, uploadFile } from "../utils/imagekit";
import { DEFAULT_LIMIT_VALUE } from "../utils/pagination";
import { fairDataFormat, fairDataFormatGeo } from "../utils/utilsFair";
import { getOwnerUserData } from "../utils/utilsOwner";
import {
  photographFormat,
  validPhotographForm,
} from "../utils/utilsPhotograph";
import { postFormat, validPostForm } from "../utils/utilsPosts";
import { standDataFormat } from "../utils/utilsStand";

export class FairService {
  static async saveFair(body: IFairForm, uid: string) {
    const user = await auth.getUser(uid);
    const userDoc = await db.collection("users").doc(uid).get();

    if (!user || !userDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Usuario no encontrado");

    const id = uuidv4();

    const newFair: any = {
      ...body,
      id,
      ownerRef: db.doc(`users/${uid}`),
      creationTimestamp: Timestamp.now(),
      stands: [],
      photographs: [],
      stars: 0,
    };

    await db.collection("fairs").doc(id).set(newFair);

    const userData = userDoc.data() as IUser;
    await db
      .collection("users")
      .doc(uid)
      .update({
        ownerFairs: [...userData.ownerFairs, db.doc(`fairs/${newFair.id}`)],
      });

    let fair: IFair = fairDataFormat(newFair as IFair);
    fair.owner = await getOwnerUserData(fair.ownerRef);

    return fair;
  }

  static async getList(
    { orderBy, orderDir, limit, lastIndex }: IQueryListRequest,
    uid?: string
  ) {
    const limitNumber = Number(limit) || DEFAULT_LIMIT_VALUE;
    const firstIndexNumber = Number(lastIndex) || 0;

    const orderField = orderBy || "stars";
    const orderDirection: OrderByDirection = orderDir || "desc";

    let snapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>;

    if (uid) {
      snapshot = await db
        .collection("fairs")
        .orderBy(orderField, orderDirection)
        .where("ownerRef", "==", db.doc(`users/${uid}`))
        .get();
    } else {
      snapshot = await db
        .collection("fairs")
        .orderBy(orderField, orderDirection)
        .get();
    }

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
      order: {
        orderBy,
        orderDir,
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

    let fair: IFair = fairDataFormat(fairDoc.data() as IFair);
    fair.owner = await getOwnerUserData(fair.ownerRef);

    return fair;
  }

  static async updateDetails(
    uid: string,
    params: ParamsDictionary,
    body: IFairForm
  ) {
    const { fairID } = params;

    if (!fairID)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Feria no encontrada");

    const fairDoc = await db.collection("fairs").doc(fairID).get();

    if (!fairDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Feria no encontrada");

    const fairData = fairDoc.data() as IFair;

    if (fairData.ownerRef.id !== uid) {
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, "Acción no permitida");
    }

    const newData = { ...fairData, ...body };

    await db.collection("fairs").doc(fairID).update(newData);

    return fairDataFormat(newData as IFair);
  }

  static async getGeolocationAll() {
    const fairsDoc = await db.collection("fairs").get();

    const fairs: IFairGeo[] = [];

    fairsDoc.forEach((doc) =>
      fairs.push(fairDataFormatGeo(doc.data() as IFairGeo))
    );

    return fairs;
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

    if (fairStandsIDs.length) {
      const snapshot = await db
        .collection("stands")
        .where("id", "in", fairStandsIDs)
        .orderBy("name", "asc")
        .get();

      snapshot.forEach((doc) => {
        stands.push(standDataFormat(doc.data() as IStand));
      });
    }

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
      .collection("fairs_reviews")
      .orderBy("creationTime", "desc")
      .where("parent", "==", db.doc(`fairs/${fairID}`))
      .get();

    let reviewUserData: IReview | null = null;

    const reviewUserID = `${uid}-${fairID}`;

    snapshot.forEach((doc) => {
      let data = doc.data() as IReview;
      reviews.push(data);

      if (doc.data().id === reviewUserID) reviewUserData = data;
    });

    for (let i = 0; i < reviews.length; i++) {
      reviews[i].owner = await getOwnerUserData(reviews[i].ownerRef);
    }

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
    const { fairID } = params;
    const { stars, comment } = body;

    const userAuth = await auth.getUser(uid);

    const fairDoc = await db.collection("fairs").doc(fairID).get();

    if (!fairDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Feria no encontrada");

    const reviewID = `${userAuth.uid}-${fairID}`;

    const reviewDoc = await db.collection("fairs_reviews").doc(reviewID).get();

    let reviewData = {};

    if (reviewDoc.exists) {
      reviewData = {
        comment: comment,
        stars: stars,
        updateTime: dayjs().format(),
      };
    } else {
      const time = dayjs().format();
      reviewData = {
        id: reviewID,
        comment: comment,
        stars: stars,
        ownerRef: db.doc(`users/${userAuth.uid}`),
        parent: db.doc(`fairs/${fairID}`),
        creationTime: time,
        updateTime: time,
      };
    }

    await db
      .collection("fairs_reviews")
      .doc(reviewID)
      .set(reviewData, { merge: true });

    const snapshotReviews = await db
      .collection("fairs_reviews")
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

  static async getPhotograph(params: ParamsDictionary) {
    const { fairID, photoID } = params;

    if (!fairID)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Feria no encontrada");

    if (!photoID)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Fotografía no encontrada");

    const fairDoc = await db.collection("fairs").doc(fairID).get();

    if (!fairDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Feria no encontrada");

    const fairData = fairDoc.data() as IFair;

    const photograph = fairData.photographs.filter(
      (photo) => photo.id === photoID
    );

    if (!photograph.length)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Fotografía no encontrada");

    return {
      photograph: photographFormat(photograph[0]),
      ownerID: fairData.ownerRef.id,
    };
  }

  static async uploadPhotograph(
    uid: string,
    params: ParamsDictionary,
    body: IPhotographForm
  ) {
    const { fairID } = params;

    const validatorResult = validPhotographForm(body);

    if (validatorResult.length) {
      throw new ErrorHandler(StatusCodes.UNPROCESSABLE_ENTITY, validatorResult);
    }

    if (!fairID)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Feria no encontrada");

    const fairDoc = await db.collection("fairs").doc(fairID).get();

    if (!fairDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Feria no encontrada");

    const fairData = fairDoc.data() as IFair;

    if (fairData.ownerRef.id !== uid) {
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, "Acción no permitida");
    }

    const { url, name, fileId } = await uploadFile({
      file: body.files[0],
      mimetype: body.files[0].mimetype || "",
      folder: `${EFolderName.FAIRS}/photos/${fairData.id}`,
    });

    body.isCover = body.isCover.toString() === "true";

    let photographs = fairData.photographs.map((photo) =>
      body.isCover ? { ...photo, isCover: false } : photo
    );

    const newPhoto: IPhotograph = {
      id: uuidv4(),
      description: body.description,
      creationTimestamp: Timestamp.now(),
      isCover: body.isCover || fairData.photographs.length === 0,
      fileId,
      name,
      url,
    };

    photographs = [newPhoto].concat(photographs);

    await db.collection("fairs").doc(fairID).update({ photographs });

    return {
      photograph: photographFormat(newPhoto),
      ownerID: fairData.ownerRef.id,
    };
  }

  static async updatePhotograph(
    uid: string,
    params: ParamsDictionary,
    body: IPhotographForm
  ) {
    const { fairID, photoID } = params;

    const validatorResult = validPhotographForm(body, false);

    if (validatorResult.length) {
      throw new ErrorHandler(StatusCodes.UNPROCESSABLE_ENTITY, validatorResult);
    }

    if (!fairID)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Feria no encontrada");

    if (!photoID)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Fotografía no encontrada");

    const fairDoc = await db.collection("fairs").doc(fairID).get();

    if (!fairDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Feria no encontrada");

    const fairData = fairDoc.data() as IFair;

    if (fairData.ownerRef.id !== uid) {
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, "Acción no permitida");
    }

    let formPhoto = fairData.photographs.find((photo) => photo.id === photoID);

    if (!formPhoto) {
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Fotografía no encontrada");
    }

    body.isCover = body.isCover.toString() === "true";

    const photographs: IPhotograph[] = [];

    for (let i = 0; i < fairData.photographs.length; i++) {
      const photo = fairData.photographs[i];
      if (photo.id === photoID) {
        formPhoto = {
          ...photo,
          description: body.description,
          isCover: body.isCover,
        };

        if (body.files.length) {
          const { url, name, fileId } = await uploadFile({
            file: body.files[0],
            mimetype: body.files[0].mimetype || "",
            folder: `${EFolderName.FAIRS}/photos/${fairData.id}`,
          });

          await deleteFile(photo.fileId);

          formPhoto = { ...formPhoto, url, name, fileId };
        }

        photographs.push(formPhoto);
      } else {
        photographs.push(body.isCover ? { ...photo, isCover: false } : photo);
      }
    }

    const hasCover = photographs.some((photo) => photo.isCover);
    if (!hasCover && photographs.length) photographs[0].isCover = true;

    await db.collection("fairs").doc(fairID).update({ photographs });

    return {
      photograph: photographFormat(formPhoto),
      ownerID: fairData.ownerRef.id,
    };
  }

  static async deletePhotograph(uid: string, params: ParamsDictionary) {
    const { fairID, photoID } = params;

    if (!fairID)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Feria no encontrada");

    if (!photoID)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Fotografía no encontrada");

    const fairDoc = await db.collection("fairs").doc(fairID).get();

    if (!fairDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Feria no encontrada");

    const fairData = fairDoc.data() as IFair;

    if (fairData.ownerRef.id !== uid) {
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, "Acción no permitida");
    }

    const photographs: IPhotograph[] = [];
    let fileId = "";

    fairData.photographs.forEach((photo) => {
      if (photo.id === photoID) fileId = photo.fileId;
      else photographs.push(photo);
    });

    if (!fileId)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Fotografía no encontrada");

    await deleteFile(fileId);

    const hasCover = photographs.some((photo) => photo.isCover);
    if (!hasCover && photographs.length) photographs[0].isCover = true;

    await db.collection("fairs").doc(fairID).update({ photographs });

    return {
      photographID: photoID,
    };
  }

  static async getListPosts(
    params: ParamsDictionary,
    { limit, lastIndex }: IQueryListRequest
  ) {
    const { fairID } = params;
    const limitNumber = Number(limit) || DEFAULT_LIMIT_VALUE;
    const firstIndexNumber = Number(lastIndex) || 0;

    const posts: IPost[] = [];

    const snapshot = await db
      .collection("fairs_posts")
      .orderBy("creationTime", "desc")
      .where("parent", "==", db.doc(`fairs/${fairID}`))
      .get();

    snapshot.forEach(async (doc) => {
      let post = doc.data() as IPost;

      // const parent = await post.parent.get();

      // if (parent.exists) {
      //   const fair = parent.data() as IFair;

      //   post.parentName = fair.name;
      //   post.parentPhoto = fair.photographs.find((photo) => photo.isCover)?.url;
      // }

      posts.push(post);
    });

    const lastIndexNew = firstIndexNumber + limitNumber;

    return {
      list: posts.length ? posts.slice(firstIndexNumber, lastIndexNew) : [],
      pagination: {
        total: snapshot.docs.length || 0,
        lastIndex: lastIndexNew,
        limit: limitNumber,
      },
    };
  }

  static async savePost(
    uid: string,
    params: ParamsDictionary,
    body: IPostForm
  ) {
    const { fairID } = params;

    const validatorResult = validPostForm(body);

    if (validatorResult.length) {
      throw new ErrorHandler(StatusCodes.UNPROCESSABLE_ENTITY, validatorResult);
    }

    if (!fairID)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Feria no encontrada");

    const fairDoc = await db.collection("fairs").doc(fairID).get();

    if (!fairDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Feria no encontrada");

    const fairData = fairDoc.data() as IFair;

    if (fairData.ownerRef.id !== uid) {
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, "Acción no permitida");
    }

    let postID = "";
    let postDoc: DocumentSnapshot<DocumentData> | undefined = undefined;
    let postData: IPost = {
      id: "",
      text: body.text,
      parent: db.doc(`fairs/${fairID}`),
      fileName: null,
      fileUrl: null,
      fileId: null,
    };

    if (body.files.length) {
      const { url, name, fileId } = await uploadFile({
        file: body.files[0],
        mimetype: body.files[0].mimetype || "",
        folder: `${EFolderName.FAIRS}/posts/${fairData.id}`,
      });

      postData = { ...postData, fileName: name, fileUrl: url, fileId };
    }

    if (body.id) {
      postDoc = await db.collection("fairs_posts").doc(body.id).get();
    }

    if (postDoc?.exists) {
      const currentData = postDoc.data() as IPost;
      postID = currentData.id ?? "";

      postData = {
        ...currentData,
        ...postData,
        id: postID,
      };

      if (body.files.length && currentData.fileId) {
        await deleteFile(currentData.fileId);
      }
    } else {
      const time = dayjs().format();
      postID = uuidv4();

      postData = {
        ...postData,
        id: postID,
        creationTimestamp: Timestamp.now(),
        creationTime: time,
      };
    }

    await db
      .collection("fairs_posts")
      .doc(postID)
      .set(postData, { merge: true });

    return {
      post: postFormat(postData),
    };
  }
}
