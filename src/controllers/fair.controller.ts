import { Handler } from "express";
import { StatusCodes } from "http-status-codes";

import { FairService } from "../services/fair.service";

export class FairController {
  static getUpcoming: Handler = async (_req, res) => {
    const fairs = await FairService.getUpcoming();

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: fairs,
      message: "Listado de próximas ferias",
    });
  };
}
