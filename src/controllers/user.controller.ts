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

  static updateUser: Handler = async (req, res) => {
    const userData = await UserService.updateUser(req.uid, req.body);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: userData,
      message: "Usuario actualizado exitosamente",
    });
  };

  static changePassword: Handler = async (req, res) => {
    await UserService.changePassword(req.uid, req.body);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      message: "Contraseña cambiada exitosamente",
    });
  };
}
