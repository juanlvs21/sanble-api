import { Handler } from "express";
import { StatusCodes } from "http-status-codes";

import { StandService } from "../services/stand.service";
import { parseFormData } from "../utils/request";

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

  static deleteReview: Handler = async (req, res) => {
    const review = await StandService.deleteReview(req.uid, req.params);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: review,
      message: "Opinión eliminada con éxito",
    });
  };

  static uploadPhotograph: Handler = async (req, res) => {
    const parse: any = await parseFormData(req);

    const photograph = await StandService.uploadPhotograph(
      req.uid,
      req.params,
      parse
    );

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: photograph,
      message: "Fotografía guardada con éxito",
    });
  };

  static updatePhotograph: Handler = async (req, res) => {
    const parse: any = await parseFormData(req);

    const photograph = await StandService.updatePhotograph(
      req.uid,
      req.params,
      parse
    );

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: photograph,
      message: "Fotografía guardada con éxito",
    });
  };

  static deletePhotograph: Handler = async (req, res) => {
    const photograph = await StandService.deletePhotograph(req.uid, req.params);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: photograph,
      message: "Fotografía Eliminada con éxito",
    });
  };

  static getListPosts: Handler = async (req, res) => {
    const posts = await StandService.getListPosts(req.params, req.query);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: posts,
      message: "Listado de publicaciones",
    });
  };

  static savePost: Handler = async (req, res) => {
    const parse: any = await parseFormData(req);

    const post = await StandService.savePost(req.uid, req.params, parse);

    res.status(StatusCodes.CREATED).json({
      statusCode: StatusCodes.CREATED,
      data: post,
      message: "Pubicación creada con éxito",
    });
  };

  static updatePost: Handler = async (req, res) => {
    const parse: any = await parseFormData(req);

    const post = await StandService.updatePost(req.uid, req.params, parse);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: post,
      message: "Pubicación actualizada con éxito",
    });
  };

  static deletePost: Handler = async (req, res) => {
    const post = await StandService.deletePost(req.uid, req.params);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: post,
      message: "Pubicación eliminada con éxito",
    });
  };

  static getListProducts: Handler = async (req, res) => {
    const products = await StandService.getListProducts(req.params, req.query);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: products,
      message: "Listado de publicaciones",
    });
  };

  static saveProduct: Handler = async (req, res) => {
    const parse: any = await parseFormData(req);

    const product = await StandService.saveProduct(req.uid, req.params, parse);

    res.status(StatusCodes.CREATED).json({
      statusCode: StatusCodes.CREATED,
      data: { product },
      message: "Producto creado con éxito",
    });
  };

  static updateProduct: Handler = async (req, res) => {
    const parse: any = await parseFormData(req);

    const product = await StandService.updateProduct(
      req.uid,
      req.params,
      parse
    );

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: { product },
      message: "Producto actualizado con éxito",
    });
  };

  static deleteProduct: Handler = async (req, res) => {
    const product = await StandService.deleteProduct(req.uid, req.params);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: product,
      message: "Producto eliminado con éxito",
    });
  };
}
