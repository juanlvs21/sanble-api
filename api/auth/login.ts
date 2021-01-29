import { NowRequest, NowResponse } from "@vercel/node";
import {
  OK,
  METHOD_NOT_ALLOWED,
  UNPROCESSABLE_ENTITY,
  UNAUTHORIZED,
  INTERNAL_SERVER_ERROR,
} from "http-status";

// Utils
import { makeConnection } from "../../utils/mongoose";
import { generateAndSignToken } from "../../utils/session";
import { valid } from "../../utils/validator";

// Models
import User from "../../models/User";

export default async (req: NowRequest, res: NowResponse) => {
  try {
    if (req.method === "POST") {
      await makeConnection(res); // Connected to the database

      const body =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body;

      const validator = await valid(body, {
        username: ["required"],
        password: ["required"],
      });
      if (!validator.valid)
        return res.status(UNPROCESSABLE_ENTITY).json({
          statusCode: UNPROCESSABLE_ENTITY,
          message: "Fields validation error",
          data: validator.errors,
        });

      // Extract data
      const { username, password } = body;

      // Validate credentials
      const user = await User.findOne({ username }).exec();
      if (!user)
        return res.status(UNAUTHORIZED).json({
          statusCode: UNAUTHORIZED,
          message: "Incorrect username or password",
          data: ["Usuario o contraseña incorrectos"],
        });

      // Compare password
      const passwordCorrect: boolean = await user.comparePassword(password);
      if (!passwordCorrect)
        return res.status(UNAUTHORIZED).json({
          statusCode: UNAUTHORIZED,
          message: "Incorrect username or password",
          data: ["Usuario o contraseña incorrectos"],
        });

      const token = await generateAndSignToken({ user: { id: user.id } });

      res.status(OK).json({
        statusCode: OK,
        message: "Successful authentication",
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
