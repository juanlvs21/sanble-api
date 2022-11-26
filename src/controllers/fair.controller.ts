import { Handler } from "express";
import { StatusCodes } from "http-status-codes";

import { FairService } from "../services/fair.service";

export class FairController {
  static getList: Handler = async (req, res) => {
    const fairs = await FairService.getList(req.query);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: fairs,
      message: "Listado de ferias",
    });
  };
  static getBest: Handler = async (_req, res) => {
    const fairs = await FairService.getBest();

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: fairs,
      message: "Listado de mejores ferias",
    });
  };
  static getDetails: Handler = async (req, res) => {
    const fair = await FairService.getDetails(req.params);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: fair,
      message: "Detalles de feria",
    });
  };
  static getGeolocationAll: Handler = async (_req, res) => {
    const fairs = await FairService.getGeolocationAll();

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: fairs,
      message: "Ubicacion de todas las ferias",
    });
  };
}
