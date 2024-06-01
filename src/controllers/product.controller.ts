import { Handler } from "express";
import { StatusCodes } from "http-status-codes";

import { ProductService } from "../services/product.service";

export class ProductController {
  static getList: Handler = async (req, res) => {
    const fairs = await ProductService.getList(req.query);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: fairs,
      message: "Listado de Productos",
    });
  };

  static getTypes: Handler = async (_req, res) => {
    const productTypes = await ProductService.getTypes();

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: productTypes,
      message: "Listado de tipos de productos",
    });
  };

  static getRecent: Handler = async (_req, res) => {
    const productRecent = await ProductService.getRecent();

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: productRecent,
      message: "Listado de productos recientes",
    });
  };
}
