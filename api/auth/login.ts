import { NowRequest, NowResponse } from "@vercel/node";
import {
  OK,
  METHOD_NOT_ALLOWED,
  UNPROCESSABLE_ENTITY,
  UNAUTHORIZED,
  INTERNAL_SERVER_ERROR,
} from "http-status";

// Middlewares
import corsMiddleware from "../../middlewares/cors";

// Utils
import { makeConnection } from "../../utils/mongoose";
import { generateAndSignToken } from "../../utils/session";
import { valid } from "../../utils/validator";

// Models
import User from "../../models/User";

export default async (req: NowRequest, res: NowResponse) => {
  await corsMiddleware(req, res);

  try {
    if (req.method === "POST") {
      await makeConnection(); // Connected to the database

      const validator = await valid(req.body, {
        username: ["required"],
        password: ["required"],
      });
      if (!validator.valid)
        return res.status(422).json({
          status: UNPROCESSABLE_ENTITY,
          message: "Fields validation error",
          data: validator.errors,
        });

      // Extract data
      const { username, password } = req.body;

      // Validate credentials
      const user = await User.findOne({ username }).exec();
      if (!user)
        return res.status(401).json({
          status: UNAUTHORIZED,
          message: "Incorrect username or password",
          data: ["Usuario o contraseña incorrectos"],
        });

      // Compare password
      const passwordCorrect: boolean = await user.comparePassword(password);
      if (!passwordCorrect)
        return res.status(401).json({
          status: UNAUTHORIZED,
          message: "Incorrect username or password",
          data: ["Usuario o contraseña incorrectos"],
        });

      const token = await generateAndSignToken({ user: { id: user.id } });

      res.status(200).json({
        status: OK,
        message: "Successful authentication",
        data: {
          user: user,
          meta: { token },
        },
      });
    } else {
      res.status(405).json({
        status: METHOD_NOT_ALLOWED,
        message: "Method Not Allowed",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: INTERNAL_SERVER_ERROR,
      message: "Internal Server Error",
    });
  }
};
