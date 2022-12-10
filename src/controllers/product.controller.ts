import { Handler } from "express";
import { StatusCodes } from "http-status-codes";

import { ProductService } from "../services/product.service";

export class ProductController {
  static getTypes: Handler = async (_req, res) => {
    const productTypes = await ProductService.getTypes();

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: productTypes,
      message: "Listado de tipos de productos",
    });
  };
}
