import { Handler } from "express";
import { StatusCodes } from "http-status-codes";

import { IS_PROD } from "../config/env";
import { AuthService } from "../services/auth.service";
import { JWT } from "../utils/jwt";
import { dayjs } from "../utils/time";

export class AuthController {
  static signUp: Handler = async (req, res) => {
    const user = await AuthService.signUp(req.body);
    // const token = JWT.generateToken({ user: { uuid: user.uuid } });

    // res.cookie("session", token, {
    //   secure: IS_PROD,
    //   httpOnly: true,
    //   expires: dayjs().add(24, "hours").toDate(),
    // });

    res.status(StatusCodes.CREATED).json({
      statusCode: StatusCodes.CREATED,
      data: user,
      message: "Usuario registrado exitosamente",
    });
  };

  static signInExternal: Handler = async (req, res) => {
    const user = await AuthService.signInExternal(req.body);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: user,
      message: "Usuario notificado exitosamente",
    });
  };

  static getUserData: Handler = async (req, res) => {
    const userData = await AuthService.getUserData(req.uid);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: userData,
      message: "Datos del usuario con sesión iniciada",
    });
  };
}
