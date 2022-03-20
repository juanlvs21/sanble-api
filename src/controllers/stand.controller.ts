import { Handler } from "express";
import { StatusCodes } from "http-status-codes";

import { StandService } from "../services/stand.service";

export class StandController {
  static getBest: Handler = async (_req, res) => {
    const stands = await StandService.getBest();

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: stands,
      message: "Listado de mejores stands",
    });
  };
}
