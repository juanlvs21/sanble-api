import { Handler } from "express";
import { StatusCodes } from "http-status-codes";
import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");

import { IS_PROD } from "../config/env";
import { UserService } from "../services/user.service";
import { JWT } from "../utils/jwt";

export class UserController {
  static signUp: Handler = async (req, res) => {
    const user = await UserService.signUp(req.body);
    // const token = JWT.generateToken({ user: { id: user.id } });
    const token = "";

    res.cookie("session", token, {
      secure: IS_PROD,
      httpOnly: true,
      expires: dayjs().add(24, "hours").toDate(),
    });

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.CREATED,
      data: user,
      message: "Usuario registrado exitosamente",
    });
  };

  static logIn: Handler = async (req, res) => {
    const user = await UserService.logIn(req.body);
    // const token = JWT.generateToken({ user: { id: user.id } });
    const token = "";

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
