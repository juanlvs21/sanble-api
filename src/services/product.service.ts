import { IProduct, IProductType } from "../interfaces/IProduct";
import { IQueryListRequest } from "../interfaces/IRequest";
import { IStand } from "../interfaces/IStand";
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

    for (let i = 0; i < products.length; i++) {
      const parent = await products[i].parent.get();
      const stand = parent.data() as IStand;
      products[i].stand = {
        id: parent.id,
        name: stand.name,
      };
    }

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

  static async getRecent() {
    const productsDoc = await db
      .collection("stands_products")
      .orderBy("creationTimestamp", "desc")
      .limit(10)
      .get();

    const products: IProduct[] = [];

    productsDoc.forEach((doc) =>
      products.push(productFormat(doc.data() as IProduct))
    );

    for (let i = 0; i < products.length; i++) {
      const parent = await products[i].parent.get();
      const stand = parent.data() as IStand;
      products[i].stand = {
        id: parent.id,
        name: stand.name,
      };
    }

    return products;
  }

  static async getTypes() {
    const standsDoc = await db.collection("types_products").get();

    const stands: IProductType[] = [];

    standsDoc.forEach((doc) => stands.push(doc.data() as IProductType));

    return stands;
  }
}
