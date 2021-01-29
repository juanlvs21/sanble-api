import { NowRequest, NowResponse } from "@vercel/node";
import { UNAUTHORIZED, INTERNAL_SERVER_ERROR } from "http-status";
import jwt from "jsonwebtoken";

// Utils
import { JWT_SECRET } from "../utils/env";

const authMiddleware = async (req: NowRequest, res: NowResponse) => {
  const token: string | string[] = req.headers["authorization"] || "";

  if (!token)
    return res.status(UNAUTHORIZED).json({
      statusCode: UNAUTHORIZED,
      message: "Invalid token",
      data: ["Sesión inválida"],
    });

  try {
    const payload: any = jwt.verify(token.toString(), JWT_SECRET);
    return payload.user;
  } catch (error) {
    console.error(error);
    res.status(INTERNAL_SERVER_ERROR).json({
      statusCode: INTERNAL_SERVER_ERROR,
      message: "Internal Server Error",
    });
  }
};

export default authMiddleware;
