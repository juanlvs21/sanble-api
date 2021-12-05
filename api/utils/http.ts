import { Response } from "express";
import { ValidationError } from "express-validator";

export const httpResErrorValidation = (errors: ValidationError[]) => {
  return errors.map((error) => error.msg);
};

export const httpResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data?: any
) => {
  res.status(statusCode).json({
    statusCode,
    message,
    data,
  });
};
