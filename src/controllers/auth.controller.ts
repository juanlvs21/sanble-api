import { Handler } from "express";
import { StatusCodes } from "http-status-codes";
import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");

import { IS_PROD } from "../config/env";
import { AuthService } from "../services/auth.service";
import { JWT } from "../utils/jwt";

export class AuthController {
  static signUp: Handler = async (req, res) => {
    const user = await AuthService.signUp(req.body);
    const token = JWT.generateToken({ user: { uuid: user.uuid } });

    res.cookie("session", token, {
      secure: IS_PROD,
      httpOnly: true,
      expires: dayjs().add(24, "hours").toDate(),
    });

    res.status(StatusCodes.CREATED).json({
      statusCode: StatusCodes.CREATED,
      data: user,
      message: "Usuario registrado exitosamente",
    });
  };

  static signIn: Handler = async (req, res) => {
    const user = await AuthService.signIn(req.body);
    const token = JWT.generateToken({ user: { uuid: user.uuid } });

    res.cookie("session", token, {
      secure: IS_PROD,
      httpOnly: true,
      expires: dayjs().add(24, "hours").toDate(),
    });

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: user,
      message: "Sesión iniciada exitosamente",
    });
  };
}
