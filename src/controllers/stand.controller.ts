import { Handler } from "express";
import { StatusCodes } from "http-status-codes";

import { StandService } from "../services/stand.service";

export class StandController {
  static getList: Handler = async (req, res) => {
    const stands = await StandService.getList(req.query);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: stands,
      message: "Listado de stands",
    });
  };

  static getBest: Handler = async (_req, res) => {
    const stands = await StandService.getBest();

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: stands,
      message: "Listado de mejores stands",
    });
  };

  static getDetails: Handler = async (req, res) => {
    const fair = await StandService.getDetails(req.params);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: fair,
      message: "Detalles de stand",
    });
  };

  static getListReviews: Handler = async (req, res) => {
    const reviews = await StandService.getListReviews(
      req.uid,
      req.params,
      req.query
    );

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: reviews,
      message: "Listado de opiniones",
    });
  };

  static saveReview: Handler = async (req, res) => {
    const review = await StandService.saveReview(req.uid, req.params, req.body);

    res.status(StatusCodes.CREATED).json({
      statusCode: StatusCodes.CREATED,
      data: review,
      message: "Opinión guardada con éxito",
    });
  };
}
