import { Request, Response } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
// Config
import { JWT_SECRET } from "@/config/env";

// Models
import User from "@/models/user";

// Utils
import { httpResErrorValidation, httpResponse } from "@/utils/http";

function createToken(user: IUser) {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
}

export const signUp: Handler = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);

    if (errors.array().length)
      return httpResponse(
        res,
        StatusCodes.BAD_REQUEST,
        "Datos inválidos",
        httpResErrorValidation(errors.array())
      );

    const { username, name, email, password } = req.body;

    const usernameExists = await User.findOne({ username });

    if (usernameExists)
      return httpResponse(
        res,
        StatusCodes.UNPROCESSABLE_ENTITY,
        "El nombre de usuario ya está en uso"
      );

    const emailExists = await User.findOne({ email });

    if (emailExists)
      return httpResponse(
        res,
        StatusCodes.UNPROCESSABLE_ENTITY,
        "La dirección de correo electrónico ya está en uso"
      );

    const user = new User({ username, name, email, password });
    await user.save();

    httpResponse(res, StatusCodes.CREATED, "Usuario creado exitosamente", {
      user,
      meta: {
        accessToken: createToken(user),
      },
    });
  } catch (error) {
    httpResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "ERROR INTERNO DEL SERVIDOR"
    );
  }
};

export const signIn: Handler = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);

    if (errors.array().length)
      return httpResponse(
        res,
        StatusCodes.BAD_REQUEST,
        "Datos inválidos",
        httpResErrorValidation(errors.array())
      );

    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user)
      return httpResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        "Error al iniciar sesión"
      );

    const isMatch = await user.comparePassword(req.body.password);

    if (!isMatch)
      return httpResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        "Error al iniciar sesión"
      );

    httpResponse(res, StatusCodes.OK, "Sesión iniciada exitosamente", {
      user,
      meta: {
        accessToken: createToken(user),
      },
    });
  } catch (error) {
    httpResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "ERROR INTERNO DEL SERVIDOR"
    );
  }
};
