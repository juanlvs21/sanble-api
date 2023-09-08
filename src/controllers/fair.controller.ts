import { Handler } from "express";
import { StatusCodes } from "http-status-codes";

import { FairService } from "../services/fair.service";
import { parseFormData } from "../utils/request";

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

  static updateDetails: Handler = async (req, res) => {
    const fair = await FairService.updateDetails(req.uid, req.params, req.body);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: fair,
      message: "Feria editada con éxito",
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

  static getStands: Handler = async (req, res) => {
    const reviews = await FairService.getStands(req.params, req.query);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: reviews,
      message: "Listado de stands en esta feria",
    });
  };

  static getListReviews: Handler = async (req, res) => {
    const reviews = await FairService.getListReviews(
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
    const review = await FairService.saveReview(req.uid, req.params, req.body);

    res.status(StatusCodes.CREATED).json({
      statusCode: StatusCodes.CREATED,
      data: review,
      message: "Opinión guardada con éxito",
    });
  };

  static deleteReview: Handler = async (req, res) => {
    const review = await FairService.deleteReview(req.uid, req.params);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: review,
      message: "Opinión eliminada con éxito",
    });
  };

  static getPhotograph: Handler = async (req, res) => {
    const photograph = await FairService.getPhotograph(req.params);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: photograph,
      message: "Detalles de Fotografía",
    });
  };

  static uploadPhotograph: Handler = async (req, res) => {
    const parse: any = await parseFormData(req);

    const photograph = await FairService.uploadPhotograph(
      req.uid,
      req.params,
      parse
    );

    res.status(StatusCodes.CREATED).json({
      statusCode: StatusCodes.CREATED,
      data: photograph,
      message: "Fotografía guardada con éxito",
    });
  };

  static updatePhotograph: Handler = async (req, res) => {
    const parse: any = await parseFormData(req);

    const photograph = await FairService.updatePhotograph(
      req.uid,
      req.params,
      parse
    );

    res.status(StatusCodes.CREATED).json({
      statusCode: StatusCodes.CREATED,
      data: photograph,
      message: "Fotografía guardada con éxito",
    });
  };

  static deletePhotograph: Handler = async (req, res) => {
    const photograph = await FairService.deletePhotograph(req.uid, req.params);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: photograph,
      message: "Fotografía Eliminada con éxito",
    });
  };

  static getListPosts: Handler = async (req, res) => {
    const reviews = await FairService.getListPosts(req.params, req.query);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: reviews,
      message: "Listado de publicaciones",
    });
  };

  static savePost: Handler = async (req, res) => {
    const parse: any = await parseFormData(req);

    const photograph = await FairService.savePost(req.uid, req.params, parse);

    res.status(StatusCodes.CREATED).json({
      statusCode: StatusCodes.CREATED,
      data: photograph,
      message: "Pubicación creada con éxito",
    });
  };
}
