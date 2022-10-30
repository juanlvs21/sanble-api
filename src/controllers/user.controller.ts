import { Handler } from "express";
import { StatusCodes } from "http-status-codes";

import { UserService } from "../services/user.service";

export class UserController {
  static signUp: Handler = async (req, res) => {
    const user = await UserService.signUp(req.body);

    res.status(StatusCodes.CREATED).json({
      statusCode: StatusCodes.CREATED,
      data: user,
      message: "Usuario registrado exitosamente",
    });
  };

  static getProfile: Handler = async (req, res) => {
    const userData = await UserService.getProfile(req.uid);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: userData,
      message: "Datos del usuario con sesión iniciada",
    });
  };

  static setFavoriteFair: Handler = async (req, res) => {
    const userData = await UserService.setFavoriteFair(req.uid, req.body);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: userData,
      message: "Se actualizó el listado de ferias favoritas",
    });
  };

  static setFavoriteStand: Handler = async (req, res) => {
    const userData = await UserService.setFavoriteStand(req.uid, req.body);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: userData,
      message: "Se actualizó el listado de stands favoritos",
    });
  };

  static setFavoriteProduct: Handler = async (req, res) => {
    const userData = await UserService.setFavoriteProduct(req.uid, req.body);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: userData,
      message: "Se actualizó el listado de productos favoritos",
    });
  };
}
