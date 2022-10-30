import { StatusCodes } from "http-status-codes";

import { ErrorHandler } from "../error";
import { IFair } from "../interfaces/IFair";
import { IQueryPagination } from "../interfaces/IRequest";
import { db } from "../utils/firebase";
import { fairDataFormat } from "../utils/utilsFair";

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
}
