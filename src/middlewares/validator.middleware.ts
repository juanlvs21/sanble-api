import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";

export const validate = (validations: any[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const statusCode = StatusCodes.UNPROCESSABLE_ENTITY;

    res.status(statusCode).json({
      status: "Ha ocurrido un error",
      errors: errors.array(),
      statusCode,
    });
  };
};
