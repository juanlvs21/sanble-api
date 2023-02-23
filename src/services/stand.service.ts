import { ParamsDictionary } from "express-serve-static-core";
import { StatusCodes } from "http-status-codes";

import { ErrorHandler } from "../error";
import { IQueryListRequest } from "../interfaces/IRequest";
import { IStand } from "../interfaces/IStand";
import { db, OrderByDirection } from "../utils/firebase";
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
}
