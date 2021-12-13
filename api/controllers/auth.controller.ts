import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";

// Utils
import { auth } from "../utils/firebase";
// import { getAppDomain } from "../utils/getHost";
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

    // const photoURL = `${getAppDomain(
    //   req.headers.host || ""
    // )}/static/avatars/default.png`;

    const user = await auth.createUser({
      uid: uuidv4(),
      email,
      password,
      displayName: name,
      emailVerified: false,
    });

    httpResponse(res, StatusCodes.CREATED, "Usuario creado exitosamente", {
      user,
    });
  } catch (error: any) {
    if (error?.code === "auth/email-already-exists") {
      return httpResponse(
        res,
        StatusCodes.UNPROCESSABLE_ENTITY,
        "La dirección de correo electrónico ya está en uso",
        ["La dirección de correo electrónico ya está en uso"]
      );
    } else {
      httpResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        "ERROR INTERNO DEL SERVIDOR"
      );
    }
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
