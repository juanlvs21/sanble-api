import dayjs from "dayjs";
import { IFair } from "../interfaces/IFair";

import { db, Timestamp } from "../utils/firebase";
import { fairDataFormat } from "../utils/utilsFair";

export class FairService {
  static async getUpcoming() {
    const fairsDoc = await db
      .collection("fairs")
      .orderBy("stars", "desc")
      .limit(10)
      .get();
    // TODO: Adding the "where" condition when discussing with Nestor

    const fairs: IFair[] = [];

    // const x = new Date("10/10/2022");
    // const a = dayjs(x).format();
    // const t = Timestamp.fromDate(x);

    // console.log(a, "   |||   ", new Date(a).toString());
    // console.log(dayjs(t.seconds * 1000).format());
    // console.log(
    //   a,
    //   "   |||   ",
    //   new Date(dayjs(t.seconds * 1000).format()).toString()
    // );

    fairsDoc.forEach((doc) => fairs.push(fairDataFormat(doc.data() as IFair)));

    return fairs;
  }
}
