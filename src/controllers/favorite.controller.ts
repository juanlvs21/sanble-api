import { Handler } from "express";
import { StatusCodes } from "http-status-codes";

import { FavoriteService } from "../services/favorite.service";

export class FavoriteController {
  static getFavoriteFair: Handler = async (req, res) => {
    const fairs = await FavoriteService.getFavoriteFair(req.query, req.uid);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: fairs,
      message: "Listado de ferias favoritas",
    });
  };

  static getFavoriteStand: Handler = async (req, res) => {
    const stands = await FavoriteService.getFavoriteStand(req.query, req.uid);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: stands,
      message: "Listado de stands favoritos",
    });
  };

  static setFavoriteFair: Handler = async (req, res) => {
    const userData = await FavoriteService.setFavoriteFair(req.uid, req.body);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: userData,
      message: "Se actualizó el listado de ferias favoritas",
    });
  };

  static setFavoriteStand: Handler = async (req, res) => {
    const userData = await FavoriteService.setFavoriteStand(req.uid, req.body);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: userData,
      message: "Se actualizó el listado de stands favoritos",
    });
  };

  static setFavoriteProduct: Handler = async (req, res) => {
    const userData = await FavoriteService.setFavoriteProduct(
      req.uid,
      req.body
    );

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: userData,
      message: "Se actualizó el listado de productos favoritos",
    });
  };
}
