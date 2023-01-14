import { StatusCodes } from "http-status-codes";

import { ErrorHandler } from "../error";
import { IQueryListRequest } from "../interfaces/IRequest";
import { IStand } from "../interfaces/IStand";
import { db } from "../utils/firebase";
import { standDataFormat } from "../utils/utilsStand";

export class StandService {
  static async getList({ limit, lastIndex }: IQueryListRequest) {
    const limitNumber = Number(limit) || 5;
    const firstIndexNumber = Number(lastIndex) || 0;

    const standsPages: IStand[] = [];

    const snapshot = await db
      .collection("stands")
      .orderBy("stars", "desc")
      .get();

    snapshot.forEach((doc) => {
      standsPages.push(standDataFormat(doc.data() as IStand));
    });

    const lastIndexNew = firstIndexNumber + limitNumber;

    return {
      list: standsPages.length
        ? standsPages.slice(firstIndexNumber, lastIndexNew)
        : [],
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
}
