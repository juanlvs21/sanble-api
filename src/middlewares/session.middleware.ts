import { Handler } from "express";
import { StatusCodes } from "http-status-codes";

import { ErrorHandler } from "../error";
import { auth } from "../utils/firebase";

export const sessionMiddleware: Handler = async (req, _res, next) => {
  const idToken = `${req.headers["authorization"]}`;

  if (!idToken) {
    next(
      new ErrorHandler(StatusCodes.UNAUTHORIZED, "Token de sesión inválido")
    );
    return;
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    req.uid = decodedToken.uid;

    next();
  } catch (err) {
    next(
      new ErrorHandler(StatusCodes.UNAUTHORIZED, "Token de sesión inválido")
    );
  }
};
