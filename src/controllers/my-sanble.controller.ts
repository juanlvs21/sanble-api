import { Handler } from "express";
import { StatusCodes } from "http-status-codes";

import { FairService } from "../services/fair.service";
import { StandService } from "../services/stand.service";

export class MySanbleController {
  static getFairsList: Handler = async (req, res) => {
    const fairs = await FairService.getList(req.query, req.uid);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: fairs,
      message: "Listado de ferias",
    });
  };

  static saveFair: Handler = async (req, res) => {
    const fair = await FairService.saveFair(req.body, req.uid);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: fair,
      message: "Feria creada exitosamente",
    });
  };

  static getStandsList: Handler = async (req, res) => {
    const stands = await StandService.getList(req.query, req.uid);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: stands,
      message: "Listado de stands",
    });
  };

  static saveStand: Handler = async (req, res) => {
    const stand = await StandService.saveStand(req.body, req.uid);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: stand,
      message: "Feria creada exitosamente",
    });
  };
}
