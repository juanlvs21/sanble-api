import { NowRequest, NowResponse } from "@vercel/node";
import {
  OK,
  METHOD_NOT_ALLOWED,
  INTERNAL_SERVER_ERROR,
  UNPROCESSABLE_ENTITY,
  UNAUTHORIZED,
} from "http-status";

// Utils
import { makeConnection } from "../../utils/mongoose";
import { valid } from "../../utils/validator";

// Models
import User from "../../models/User";

export default async (req: NowRequest, res: NowResponse) => {
  try {
    if (req.method === "OPTIONS") {
      res.status(OK).end();
    } else if (req.method === "POST") {
      await makeConnection(res); // Connected to the database

      const body =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body;

      const validator = await valid(body, {
        token: ["required"],
      });
      if (!validator.valid)
        return res.status(UNPROCESSABLE_ENTITY).json({
          statusCode: UNPROCESSABLE_ENTITY,
          message: "Fields validation error",
          data: validator.errors,
        });

      // Extract data
      const { token } = body;

      const user = await User.findOne({ token_email_verified: token }).exec();
      if (!user)
        return res.status(UNAUTHORIZED).json({
          statusCode: UNAUTHORIZED,
          message: "Invalid token",
          data: ["Token Inválido"],
        });

      await User.updateOne(
        { token_email_verified: token },
        {
          token_email_verified: null,
        }
      );

      res.status(OK).json({
        statusCode: OK,
        message: "Account activated successfully",
        data: ["Cuenta activada exitosamente"],
      });
    } else {
      res.status(METHOD_NOT_ALLOWED).json({
        statusCode: METHOD_NOT_ALLOWED,
        message: "Method Not Allowed",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(INTERNAL_SERVER_ERROR).json({
      statusCode: INTERNAL_SERVER_ERROR,
      message: "Internal Server Error",
    });
  }
};
