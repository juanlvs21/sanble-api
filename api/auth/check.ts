import { NowRequest, NowResponse } from "@vercel/node";
import {
  OK,
  METHOD_NOT_ALLOWED,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
} from "http-status";

// Middlewares
import authMiddleware from "../../middlewares/auth";

// Utils
import { makeConnection } from "../../utils/mongoose";
import { generateAndSignToken } from "../../utils/session";

// Models
import User from "../../models/User";

export default async (req: NowRequest, res: NowResponse) => {
  try {
    if (req.method === "OPTIONS") {
      res.status(OK).end();
    } else if (req.method === "POST") {
      await makeConnection(res); // Connected to the database

      let session: any = await authMiddleware(req, res);

      if (session && session.id) {
        const user = await User.findById(session.id).exec();

        if (!user)
          return res.status(UNAUTHORIZED).json({
            statusCode: UNAUTHORIZED,
            message: "Access token is missing or invalid",
          });

        const token = await generateAndSignToken({ user: { id: session.id } });

        res.status(OK).json({
          statusCode: OK,
          message: "Successful check authentication",
          data: {
            user: {
              url_avatar: user.url_avatar,
              is_active: user.is_active,
              admin: user.admin,
              email_verified_at: user.email_verified_at,
              uuid: user.uuid,
              name: user.name,
              username: user.username,
              email: user.email,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
            },
            meta: { token },
          },
        });
      } else {
        return res.status(UNAUTHORIZED).json({
          statusCode: UNAUTHORIZED,
          message: "Invalid token",
          data: ["Sesión inválida"],
        });
      }
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
