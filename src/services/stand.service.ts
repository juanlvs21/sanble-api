import { IQueryListRequest } from "../interfaces/IRequest";
import { IStand } from "../interfaces/IStand";
import { db } from "../utils/firebase";
import { DEFAULT_LIMIT_VALUE } from "../utils/pagination";
import { standDataFormat } from "../utils/utilsStand";

export class StandService {
  static async getList({ limit, lastIndex }: IQueryListRequest) {
    const limitNumber = Number(limit) || DEFAULT_LIMIT_VALUE;
    const firstIndexNumber = Number(lastIndex) || 0;

    const stands: IStand[] = [];

    const snapshot = await db
      .collection("stands")
      .orderBy("stars", "desc")
      .get();

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
}
