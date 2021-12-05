import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";

// Utils
import { auth } from "../utils/firebase";
import { httpResErrorValidation, httpResponse } from "../utils/http";

export const signUp: Handler = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);

    if (errors.array().length)
      return httpResponse(
        res,
        StatusCodes.UNPROCESSABLE_ENTITY,
        "Datos inválidos",
        httpResErrorValidation(errors.array())
      );

    const { name, email, password } = req.body;

    const emailExists = await auth.getUserByEmail(email);

    if (emailExists)
      return httpResponse(
        res,
        StatusCodes.UNPROCESSABLE_ENTITY,
        "La dirección de correo electrónico ya está en uso"
      );

    const user = await auth.createUser({
      email,
      password,
      displayName: name,
      emailVerified: false,
      photoURL: null,
    });

    httpResponse(res, StatusCodes.CREATED, "Usuario creado exitosamente", {
      user,
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

    httpResponse(res, StatusCodes.OK, "Sesión iniciada exitosamente", {
      user: null,
    });
  } catch (error) {
    httpResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "ERROR INTERNO DEL SERVIDOR"
    );
  }
};
