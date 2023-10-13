import { IProduct, IProductType } from "../interfaces/IProduct";
import { IQueryListRequest } from "../interfaces/IRequest";
import { OrderByDirection, db } from "../utils/firebase";
import { DEFAULT_LIMIT_VALUE } from "../utils/pagination";
import { productFormat } from "../utils/utilsProduct";

export class ProductService {
  static async getList(
    { orderBy, orderDir, limit, lastIndex }: IQueryListRequest,
    uid?: string
  ) {
    const limitNumber = Number(limit) || DEFAULT_LIMIT_VALUE;
    const firstIndexNumber = Number(lastIndex) || 0;

    const orderField = orderBy || "stars";
    const orderDirection: OrderByDirection = orderDir || "desc";

    const snapshot = await db
      .collection("stands_products")
      .orderBy(orderField, orderDirection)
      .get();

    const products: IProduct[] = [];

    snapshot.forEach((doc) => {
      products.push(productFormat(doc.data() as IProduct));
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
      order: {
        orderBy,
        orderDir,
      },
    };
  }

  static async getTypes() {
    const standsDoc = await db.collection("types_products").get();

    const stands: IProductType[] = [];

    standsDoc.forEach((doc) => stands.push(doc.data() as IProductType));

    return stands;
  }
}
