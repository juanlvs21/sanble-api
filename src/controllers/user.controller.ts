import { Handler } from "express";
import { StatusCodes } from "http-status-codes";

import { IS_PROD } from "../config/env";
import { UserService } from "../services/user.service";
import { JWT } from "../utils/jwt";
import { dayjs } from "../utils/time";

export class UserController {
  static signUp: Handler = async (req, res) => {
    const user = await UserService.signUp(req.body);
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

  static getProfile: Handler = async (req, res) => {
    const userData = await UserService.getProfile(req.uid);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: userData,
      message: "Datos del usuario con sesión iniciada",
    });
  };
}
