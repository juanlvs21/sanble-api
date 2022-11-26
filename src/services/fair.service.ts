import { ParamsDictionary } from "express-serve-static-core";
import { StatusCodes } from "http-status-codes";

import { ErrorHandler } from "../error";
import { IFair, IFairGeo } from "../interfaces/IFair";
import { IQueryPagination } from "../interfaces/IRequest";
import { db } from "../utils/firebase";
import { fairDataFormat, fairDataFormatGeo } from "../utils/utilsFair";

export class FairService {
  static async getList({ page, perPage }: IQueryPagination) {
    const pageNumber = Number(page) || 1;
    const perPageNumber = Number(perPage) || 5;

    const fairsPages: IFair[][] = [[]];

    const snapshot = await db
      .collection("fairs")
      .orderBy("stars", "desc")
      .get();

    let arrayPos = 0;

    snapshot.forEach((doc) => {
      fairsPages[arrayPos].push(fairDataFormat(doc.data() as IFair));

      if (fairsPages[arrayPos].length === perPageNumber) {
        fairsPages.push([]);
        arrayPos++;
      }
    });
    // empanada, licor, pasta, animax, car

    if (pageNumber > fairsPages.length) {
      throw new ErrorHandler(
        StatusCodes.UNPROCESSABLE_ENTITY,
        `La página ${pageNumber} no existe`
      );
    }

    return {
      fairs: fairsPages.length ? fairsPages[pageNumber - 1] : [],
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
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Feria no encontrado");

    const fairDoc = await db.collection("fairs").doc(fairID).get();

    if (!fairDoc.exists)
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Feria no encontrado");

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
}
