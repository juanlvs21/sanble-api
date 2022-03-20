import { Handler } from "express";
import { StatusCodes } from "http-status-codes";

import { JWT } from "../utils/jwt";
import { ErrorHandler } from "../error";

export const auth: Handler = (req, _res, next) => {
  let token = req.headers["authorization"];
  if (!token) {
    next(new ErrorHandler(StatusCodes.BAD_REQUEST, "Token is Required"));
    return;
  }

  try {
    token = token.split(" ")[1];
    const payload = JWT.verifyToken(token);
    req.user = payload.user;
    next();
  } catch (err) {
    next(new ErrorHandler(StatusCodes.BAD_REQUEST, "Invalid Token"));
  }
};
