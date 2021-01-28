// Copyright 2020 Dofusturas ~ All rights reserved.

import { UNAUTHORIZED } from "http-status";
import jwt from "jsonwebtoken";

import { ErrorHandler } from "@/error";
import { JWT_SECRET } from "@/config";

const authMiddleware: Handler = async (req, res, next) => {
  const token = req.headers["authorization"] || "";

  if (!token) {
    next(new ErrorHandler(UNAUTHORIZED, "no token provided"));
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as IPayload;
    req.user = payload.user;
    next();
  } catch (err) {
    next(err);
  }
};

export default authMiddleware;
