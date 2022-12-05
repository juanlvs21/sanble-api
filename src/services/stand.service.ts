import { StatusCodes } from "http-status-codes";

import { ErrorHandler } from "../error";
import { IQueryPagination } from "../interfaces/IRequest";
import { IStand } from "../interfaces/IStand";
import { db } from "../utils/firebase";
import { standDataFormat } from "../utils/utilsStand";

export class StandService {
  static async getList({ page, perPage }: IQueryPagination) {
    const pageNumber = Number(page) || 1;
    const perPageNumber = Number(perPage) || 5;

    const standsPages: IStand[][] = [[]];

    const snapshot = await db
      .collection("stands")
      .orderBy("stars", "desc")
      .get();

    let arrayPos = 0;

    snapshot.forEach((doc) => {
      standsPages[arrayPos].push(standDataFormat(doc.data() as IStand));

      if (standsPages[arrayPos].length === perPageNumber) {
        standsPages.push([]);
        arrayPos++;
      }
    });

    if (pageNumber > standsPages.length) {
      throw new ErrorHandler(
        StatusCodes.UNPROCESSABLE_ENTITY,
        `La página ${pageNumber} no existe`
      );
    }

    return {
      list: standsPages.length ? standsPages[pageNumber - 1] : [],
      pagination: {
        total: snapshot.docs.length || 0,
        totalPages: standsPages.length,
        page: pageNumber,
        perPage: perPageNumber,
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
}
