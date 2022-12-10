import { IProductType } from "../interfaces/IProduct";
import { db } from "../utils/firebase";

export class ProductService {
  static async getTypes() {
    const standsDoc = await db.collection("types_products").get();

    const stands: IProductType[] = [];

    standsDoc.forEach((doc) => stands.push(doc.data() as IProductType));

    return stands;
  }
}
