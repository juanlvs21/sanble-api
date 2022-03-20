import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export function handleNotFound(
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const statusCode = StatusCodes.NOT_FOUND;
  res
    .status(statusCode)
    .json({ status: "Ruta no encontrada", url: req.url, statusCode });
}
