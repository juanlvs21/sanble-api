import { Response, Request, NextFunction } from "express";

// import { httpResponse } from "../utils/http";

const handleErrorMiddleware = (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // httpResponse(res, );
};

export default handleErrorMiddleware;
