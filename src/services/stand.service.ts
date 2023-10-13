import dayjs from "dayjs";
import { ParamsDictionary } from "express-serve-static-core";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";

import { ErrorHandler } from "../error";
import { EFolderName } from "../interfaces/IFile";
import { ENotificationType } from "../interfaces/INotification";
import { IPhotograph, IPhotographForm } from "../interfaces/IPhotograph";
import { IPost, IPostForm } from "../interfaces/IPost";
import { IQueryListRequest } from "../interfaces/IRequest";
import { IReview } from "../interfaces/IReview";
import { IStand, IStandForm } from "../interfaces/IStand";
import { IUser } from "../interfaces/IUser";
import {
  DocumentData,
  DocumentSnapshot,
  OrderByDirection,
  Timestamp,
  auth,
  db,
} from "../utils/firebase";
import { deleteFile, uploadFile } from "../utils/imagekit";
import { DEFAULT_LIMIT_VALUE } from "../utils/pagination";
import { sendNotification } from "../utils/sendNotification";
import { getOwnerUserData } from "../utils/utilsOwner";
import {
  photographFormat,
  validPhotographForm,
} from "../utils/utilsPhotograph";
import { postFormat, validPostForm } from "../utils/utilsPosts";
import { standDataFormat } from "../utils/utilsStand";
import { productFormat, validProductForm } from "../utils/utilsProduct";
import { IProduct, IProductForm } from "../interfaces/IProduct";

export class StandService {
  static async saveStand(body: IStandForm, uid: string) {
    const user = await auth.getUser(uid);
    const userDoc = await db.collection("users").doc(uid).get();

    if (!user || !userDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Usuario no encontrado");

    const id = uuidv4();

    const newStand: any = {
      ...body,
      id,
      ownerRef: db.doc(`users/${uid}`),
      creationTimestamp: Timestamp.now(),
      fairs: [],
      photographs: [],
      stars: 0,
    };

    await db.collection("stands").doc(id).set(newStand);

    const userData = userDoc.data() as IUser;
    await db
      .collection("users")
      .doc(uid)
      .update({
        ownerStands: [...userData.ownerStands, db.doc(`stands/${newStand.id}`)],
      });

    let stand: IStand = standDataFormat(newStand as IStand);
    stand.owner = await getOwnerUserData(stand.ownerRef);

    await sendNotification({
      title: `${stand.name} es nuevo en Sanble, quizás tenga algo que te guste`,
      body: stand.description.slice(0, 120),
      data: {
        type: ENotificationType.STAND_NEW,
        standID: stand.id,
        redirectURL: `/app/stands/${stand.id}`,
      },
    });

    return stand;
  }

  static async updateDetails(
    uid: string,
    params: ParamsDictionary,
    body: IStandForm
  ) {
    const { standID } = params;

    if (!standID)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Stand no encontrado");

    const standDoc = await db.collection("stands").doc(standID).get();

    if (!standDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Stand no encontrado");

    const standData = standDoc.data() as IStand;

    if (standData.ownerRef.id !== uid) {
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, "Acción no permitida");
    }

    const newData = { ...standData, ...body };

    await db.collection("stands").doc(standID).update(newData);

    return standDataFormat(newData as IStand);
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
        .collection("stands")
        .orderBy(orderField, orderDirection)
        .where("ownerRef", "==", db.doc(`users/${uid}`))
        .get();
    } else {
      snapshot = await db
        .collection("stands")
        .orderBy(orderField, orderDirection)
        .get();
    }

    const stands: IStand[] = [];

    snapshot.forEach((doc) => {
      stands.push(standDataFormat(doc.data() as IStand));
    });

    const list = stands.length
      ? stands.slice(firstIndexNumber, firstIndexNumber + limitNumber)
      : [];

    return {
      list,
      pagination: {
        total: snapshot.docs.length || 0,
        lastIndex: firstIndexNumber + list.length,
        limit: limitNumber,
      },
      order: {
        orderBy,
        orderDir,
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

    let stand: IStand = standDataFormat(standDoc.data() as IStand);
    stand.owner = await getOwnerUserData(stand.ownerRef);

    return stand;
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
      .collection("stands_reviews")
      .orderBy("creationTime", "desc")
      .where("parent", "==", db.doc(`stands/${standID}`))
      .get();

    let reviewUserData = null;

    const reviewUserID = `${uid}-${standID}`;

    snapshot.forEach((doc) => {
      let data = doc.data() as IReview;
      reviews.push(data);

      if (doc.data().id === reviewUserID) reviewUserData = data;
    });

    for (let i = 0; i < reviews.length; i++) {
      reviews[i].owner = await getOwnerUserData(reviews[i].ownerRef);
    }

    const list = reviews.length
      ? reviews.slice(firstIndexNumber, firstIndexNumber + limitNumber)
      : [];

    return {
      list,
      form: reviewUserData,
      pagination: {
        total: snapshot.docs.length || 0,
        lastIndex: firstIndexNumber + list.length,
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

    const userAuth = await auth.getUser(uid);

    const standDoc = await db.collection("stands").doc(standID).get();

    if (!standDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Stand no encontrado");

    const reviewID = `${userAuth.uid}-${standID}`;

    const reviewDoc = await db.collection("stands_reviews").doc(reviewID).get();

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
        ownerRef: db.doc(`user/${userAuth.uid}`),
        parent: db.doc(`stands/${standID}`),
        creationTime: time,
        updateTime: time,
      };
    }

    await db
      .collection("stands_reviews")
      .doc(reviewID)
      .set(reviewData, { merge: true });

    const snapshotReviews = await db
      .collection("stands_reviews")
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

  static async deleteReview(uid: string, params: ParamsDictionary) {
    const { standID } = params;

    const userAuth = await auth.getUser(uid);

    const standDoc = await db.collection("stands").doc(standID).get();

    if (!standDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Stand no encontrado");

    const reviewID = `${userAuth.uid}-${standID}`;

    const reviewDoc = await db.collection("stands_reviews").doc(reviewID).get();

    if (!reviewDoc.exists) {
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Opinión no encontrada");
    }

    await db.collection("stands_reviews").doc(reviewID).delete();

    return {
      reviewID,
    };
  }

  static async uploadPhotograph(
    uid: string,
    params: ParamsDictionary,
    body: IPhotographForm
  ) {
    const { standID } = params;

    const validatorResult = validPhotographForm(body);

    if (validatorResult.length) {
      throw new ErrorHandler(StatusCodes.UNPROCESSABLE_ENTITY, validatorResult);
    }

    if (!standID)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Stand no encontrado");

    const standDoc = await db.collection("stands").doc(standID).get();

    if (!standDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Stand no encontrado");

    const standData = standDoc.data() as IStand;

    if (standData.ownerRef.id !== uid) {
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, "Acción no permitida");
    }

    const { url, name, fileId } = await uploadFile({
      file: body.files[0],
      mimetype: body.files[0].mimetype || "",
      folder: `sanble/${EFolderName.STANDS}/${standData.id}/photos`,
    });

    body.isCover = body.isCover.toString() === "true";

    let photographs = standData.photographs.map((photo) =>
      body.isCover ? { ...photo, isCover: false } : photo
    );

    const newPhoto: IPhotograph = {
      id: uuidv4(),
      description: body.description,
      creationTimestamp: Timestamp.now(),
      isCover: body.isCover || standData.photographs.length === 0,
      fileId,
      name,
      url,
    };

    photographs = [newPhoto].concat(photographs);

    await db.collection("stands").doc(standID).update({ photographs });

    await sendNotification({
      title: `${standData.name} tienes una nueva fotografía para mostrar`,
      body: "Ve a ver de que se trata",
      imageUrl: newPhoto.url,
      data: {
        type: ENotificationType.STAND_PHOTO,
        photoID: newPhoto.id,
        redirectURL: `/app/stands/${standData.id}/fotos?photo_id=${newPhoto.id}`,
      },
    });

    return {
      photograph: photographFormat(newPhoto),
      ownerID: standData.ownerRef.id,
    };
  }

  static async updatePhotograph(
    uid: string,
    params: ParamsDictionary,
    body: IPhotographForm
  ) {
    const { standID, photoID } = params;

    const validatorResult = validPhotographForm(body, false);

    if (validatorResult.length) {
      throw new ErrorHandler(StatusCodes.UNPROCESSABLE_ENTITY, validatorResult);
    }

    if (!standID)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Stand no encontrado");

    if (!photoID)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Fotografía no encontrada");

    const standDoc = await db.collection("stands").doc(standID).get();

    if (!standDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Stand no encontrado");

    const standData = standDoc.data() as IStand;

    if (standData.ownerRef.id !== uid) {
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, "Acción no permitida");
    }

    let formPhoto = standData.photographs.find((photo) => photo.id === photoID);

    if (!formPhoto) {
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Fotografía no encontrada");
    }

    body.isCover = body.isCover.toString() === "true";

    const photographs: IPhotograph[] = [];

    for (let i = 0; i < standData.photographs.length; i++) {
      const photo = standData.photographs[i];
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
            folder: `sanble/${EFolderName.FAIRS}/photos/${standData.id}`,
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

    await db.collection("stands").doc(standID).update({ photographs });

    return {
      photograph: photographFormat(formPhoto),
      ownerID: standData.ownerRef.id,
    };
  }

  static async deletePhotograph(uid: string, params: ParamsDictionary) {
    const { standID, photoID } = params;

    if (!standID)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Stand no encontrado");

    if (!photoID)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Fotografía no encontrada");

    const standDoc = await db.collection("stands").doc(standID).get();

    if (!standDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Stand no encontrado");

    const standData = standDoc.data() as IStand;

    if (standData.ownerRef.id !== uid) {
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, "Acción no permitida");
    }

    const photographs: IPhotograph[] = [];
    let fileId = "";

    standData.photographs.forEach((photo) => {
      if (photo.id === photoID) fileId = photo.fileId;
      else photographs.push(photo);
    });

    if (!fileId)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Fotografía no encontrada");

    await deleteFile(fileId);

    const hasCover = photographs.some((photo) => photo.isCover);
    if (!hasCover && photographs.length) photographs[0].isCover = true;

    await db.collection("stands").doc(standID).update({ photographs });

    return {
      photographID: photoID,
    };
  }

  static async getListPosts(
    params: ParamsDictionary,
    { limit, lastIndex }: IQueryListRequest
  ) {
    const { standID } = params;
    const limitNumber = Number(limit) || DEFAULT_LIMIT_VALUE;
    const firstIndexNumber = Number(lastIndex) || 0;

    if (!standID)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Stand no encontrado");

    const standDoc = await db.collection("stands").doc(standID).get();

    if (!standDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Stand no encontrado");

    const posts: IPost[] = [];

    const snapshot = await db
      .collection("stands_posts")
      .orderBy("creationTime", "desc")
      .where("parent", "==", db.doc(`stands/${standID}`))
      .get();

    snapshot.forEach(async (doc) => {
      let post = doc.data() as IPost;

      posts.push(post);
    });

    const list = posts.length
      ? posts.slice(firstIndexNumber, firstIndexNumber + limitNumber)
      : [];

    return {
      list,
      pagination: {
        total: snapshot.docs.length || 0,
        lastIndex: firstIndexNumber + list.length,
        limit: limitNumber,
      },
    };
  }

  static async savePost(
    uid: string,
    params: ParamsDictionary,
    body: IPostForm
  ) {
    const { standID } = params;

    const validatorResult = validPostForm(body);

    if (validatorResult.length) {
      throw new ErrorHandler(StatusCodes.UNPROCESSABLE_ENTITY, validatorResult);
    }

    if (!standID)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Stand no encontrado");

    const standDoc = await db.collection("stands").doc(standID).get();

    if (!standDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Stand no encontrado");

    const standData = standDoc.data() as IStand;

    if (standData.ownerRef.id !== uid) {
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, "Acción no permitida");
    }

    let postID = "";
    let postDoc: DocumentSnapshot<DocumentData> | undefined = undefined;
    let postData: IPost = {
      id: "",
      text: body.text,
      parent: db.doc(`stands/${standID}`),
      fileName: null,
      fileUrl: null,
      fileId: null,
    };

    if (body.files.length) {
      const { url, name, fileId } = await uploadFile({
        file: body.files[0],
        mimetype: body.files[0].mimetype || "",
        folder: `sanble/${EFolderName.STANDS}/${standData.id}/posts`,
      });

      postData = { ...postData, fileName: name, fileUrl: url, fileId };
    }

    if (body.id) {
      postDoc = await db.collection("stands_posts").doc(body.id).get();
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
      .collection("stands_posts")
      .doc(postID)
      .set(postData, { merge: true });

    await sendNotification({
      title: `¡Ey! ${standData.name} tiene una nueva publicación`,
      body: postData.text.slice(0, 120),
      imageUrl: postData.fileUrl,
      data: {
        type: ENotificationType.STAND_POST,
        fairID: standData.id,
        redirectURL: `/app/stands/${standData.id}?post_id=${postData.id}`,
      },
    });

    return {
      post: postFormat(postData),
    };
  }

  static async updatePost(
    uid: string,
    params: ParamsDictionary,
    body: IPostForm
  ) {
    const { standID, postID } = params;

    const validatorResult = validPostForm(body);

    if (validatorResult.length) {
      throw new ErrorHandler(StatusCodes.UNPROCESSABLE_ENTITY, validatorResult);
    }

    if (!standID)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Stand no encontrado");

    if (!postID)
      throw new ErrorHandler(
        StatusCodes.NOT_FOUND,
        "Publicación no encontrada"
      );

    const standDoc = await db.collection("stands").doc(standID).get();

    if (!standDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Stand no encontrado");

    const standData = standDoc.data() as IStand;

    if (standData.ownerRef.id !== uid) {
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, "Acción no permitida");
    }

    const postDoc = await db.collection("stands_posts").doc(postID).get();

    if (!postDoc.exists)
      throw new ErrorHandler(
        StatusCodes.NOT_FOUND,
        "Publicación no encontrada"
      );

    let postData = postDoc.data() as IPost;

    if (body.files.length) {
      const { url, name, fileId } = await uploadFile({
        file: body.files[0],
        mimetype: body.files[0].mimetype || "",
        folder: `sanble/${EFolderName.STANDS}/${standData.id}/posts`,
      });

      if (postData.fileId) {
        await deleteFile(postData.fileId);
      }

      postData = { ...postData, fileName: name, fileUrl: url, fileId };
    }

    await db
      .collection("stands_posts")
      .doc(postID)
      .set({ ...postData, text: body.text }, { merge: true });

    return {
      post: postFormat(postData),
    };
  }

  static async deletePost(uid: string, params: ParamsDictionary) {
    const { standID, postID } = params;

    if (!standID)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Stand no encontrado");

    if (!postID)
      throw new ErrorHandler(
        StatusCodes.NOT_FOUND,
        "Publicación no encontrada"
      );

    const standDoc = await db.collection("stands").doc(standID).get();

    if (!standDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Stand no encontrado");

    const fairData = standDoc.data() as IStand;

    if (fairData.ownerRef.id !== uid) {
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, "Acción no permitida");
    }

    const postDoc = await db.collection("stands_posts").doc(postID).get();

    if (!postDoc.exists)
      throw new ErrorHandler(
        StatusCodes.NOT_FOUND,
        "Publicación no encontrada"
      );

    const postData = postDoc.data() as IPost;

    if (postData.fileId) await deleteFile(postData.fileId);

    await db.collection("stands_posts").doc(postID).delete();

    return {
      postID,
    };
  }

  static async getListProducts(
    params: ParamsDictionary,
    { limit, lastIndex }: IQueryListRequest
  ) {
    const { standID } = params;
    const limitNumber = Number(limit) || DEFAULT_LIMIT_VALUE;
    const firstIndexNumber = Number(lastIndex) || 0;

    if (!standID)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Stand no encontrado");

    const standDoc = await db.collection("stands").doc(standID).get();

    if (!standDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Stand no encontrado");

    const products: IProduct[] = [];

    const snapshot = await db
      .collection("stands_products")
      .orderBy("creationTime", "desc")
      .where("parent", "==", db.doc(`stands/${standID}`))
      .get();

    snapshot.forEach(async (doc) => {
      let post = doc.data() as IProduct;

      products.push(post);
    });

    const list = products.length
      ? products.slice(firstIndexNumber, firstIndexNumber + limitNumber)
      : [];

    return {
      list,
      pagination: {
        total: snapshot.docs.length || 0,
        lastIndex: firstIndexNumber + list.length,
        limit: limitNumber,
      },
    };
  }

  static async saveProduct(
    uid: string,
    params: ParamsDictionary,
    body: IProductForm
  ) {
    const { standID } = params;

    const validatorResult = validProductForm(body);

    if (validatorResult.length) {
      throw new ErrorHandler(StatusCodes.UNPROCESSABLE_ENTITY, validatorResult);
    }

    if (!standID)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Stand no encontrado");

    const standDoc = await db.collection("stands").doc(standID).get();

    if (!standDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Stand no encontrado");

    const standData = standDoc.data() as IStand;

    if (standData.ownerRef.id !== uid) {
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, "Acción no permitida");
    }

    let productID = "";
    let productDoc: DocumentSnapshot<DocumentData> | undefined = undefined;
    let productData: IProduct = {
      id: "",
      name: body.name,
      description: body.description,
      price: body.price,
      type: body.type,
      currency: body.currency,
      parent: db.doc(`stands/${standID}`),
      fileName: null,
      fileUrl: null,
      fileId: null,
    };

    if (body.files.length) {
      const { url, name, fileId } = await uploadFile({
        file: body.files[0],
        mimetype: body.files[0].mimetype || "",
        folder: `sanble/${EFolderName.STANDS}/${standData.id}/product`,
      });

      productData = { ...productData, fileName: name, fileUrl: url, fileId };
    }

    if (body.id) {
      productDoc = await db.collection("stands_products").doc(body.id).get();
    }

    if (productDoc?.exists) {
      const currentData = productDoc.data() as IPost;
      productID = currentData.id ?? "";

      productData = {
        ...currentData,
        ...productData,
        id: productID,
      };

      if (body.files.length && currentData.fileId) {
        await deleteFile(currentData.fileId);
      }
    } else {
      const time = dayjs().format();
      productID = uuidv4();

      productData = {
        ...productData,
        id: productID,
        creationTimestamp: Timestamp.now(),
        creationTime: time,
      };
    }

    await db
      .collection("stands_products")
      .doc(productID)
      .set(productData, { merge: true });

    await sendNotification({
      title: `${standData.name} tiene un nuevo producto, ve a verlo`,
      body: `${productData.name}: ${productData.description.slice(0, 100)}`,
      imageUrl: productData.fileUrl,
      data: {
        type: ENotificationType.STAND_POST,
        fairID: standData.id,
        redirectURL: `/app/stands/${standData.id}/productos/?product_id=${productData.id}`,
      },
    });

    return productFormat(productData);
  }

  static async updateProduct(
    uid: string,
    params: ParamsDictionary,
    body: IProductForm
  ) {
    const { standID, productID } = params;

    const validatorResult = validProductForm(body);

    if (validatorResult.length) {
      throw new ErrorHandler(StatusCodes.UNPROCESSABLE_ENTITY, validatorResult);
    }

    if (!standID)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Stand no encontrado");

    if (!productID)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Producto no encontrado");

    const standDoc = await db.collection("stands").doc(standID).get();

    if (!standDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Stand no encontrado");

    const standData = standDoc.data() as IStand;

    if (standData.ownerRef.id !== uid) {
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, "Acción no permitida");
    }

    const productDoc = await db
      .collection("stands_products")
      .doc(productID)
      .get();

    if (!productDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Producto no encontrado");

    let productData = productDoc.data() as IProduct;

    if (body.files.length) {
      const { url, name, fileId } = await uploadFile({
        file: body.files[0],
        mimetype: body.files[0].mimetype || "",
        folder: `sanble/${EFolderName.STANDS}/${standData.id}/posts`,
      });

      if (productData.fileId) {
        await deleteFile(productData.fileId);
      }

      productData = { ...productData, fileName: name, fileUrl: url, fileId };
    }

    const updateProduct = {
      ...productData,
      name: body.name,
      description: body.description,
      price: body.price,
      type: body.type,
      currency: body.currency,
    };

    await db
      .collection("stands_products")
      .doc(productID)
      .set(updateProduct, { merge: true });

    return productFormat(updateProduct);
  }

  static async deleteProduct(uid: string, params: ParamsDictionary) {
    const { standID, productID } = params;

    if (!standID)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Stand no encontrado");

    if (!productID)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Producto no encontrado");

    const standDoc = await db.collection("stands").doc(standID).get();

    if (!standDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Stand no encontrado");

    const fairData = standDoc.data() as IStand;

    if (fairData.ownerRef.id !== uid) {
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, "Acción no permitida");
    }

    const productDoc = await db
      .collection("stands_products")
      .doc(productID)
      .get();

    if (!productDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Producto no encontrado");

    const productData = productDoc.data() as IProduct;

    if (productData.fileId) await deleteFile(productData.fileId);

    await db.collection("stands_products").doc(productID).delete();

    return {
      productID,
    };
  }
}
