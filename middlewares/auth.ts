import { NowRequest, NowResponse } from "@vercel/node";
import { UNAUTHORIZED } from "http-status";
import jwt from "jsonwebtoken";

// Utils
import { JWT_SECRET } from "../utils/env";

const authMiddleware = (req: NowRequest, res: NowResponse) => {
  return new Promise((resolve, reject) => {
    const token: any = req.headers["authorization"] || "";

    if (token) {
      try {
        const payload: any = jwt.verify(token, JWT_SECRET);
        resolve(payload.user);
      } catch (error) {
        console.error(error);
        res.status(UNAUTHORIZED).json({
          statusCode: UNAUTHORIZED,
          message: "Access token is missing or invalid",
        });
      }
    } else {
      res.status(UNAUTHORIZED).json({
        statusCode: UNAUTHORIZED,
        message: "Access token is missing or invalid",
      });
    }
  });
};

export default authMiddleware;
