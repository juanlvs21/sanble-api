import { NowRequest, NowResponse } from "@vercel/node";
import {
  OK,
  METHOD_NOT_ALLOWED,
  UNPROCESSABLE_ENTITY,
  INTERNAL_SERVER_ERROR,
} from "http-status";
import { v1 as uuidv1 } from "uuid";

// Utils
import { makeConnection } from "../../utils/mongoose";
import { generateAndSignToken } from "../../utils/session";
import { valid } from "../../utils/validator";

// Models
import User from "../../models/User";

export default async (req: NowRequest, res: NowResponse) => {
  try {
    if (req.method === "POST") {
      await makeConnection(); // Connected to the database

      const validator = await valid(req.body, {
        username: ["required", "min:4"],
        name: ["required"],
        email: ["required", "email"],
        password: ["required", "password"],
        confirmPassword: ["required"],
      });
      if (!validator.valid)
        return res.status(422).json({
          statusCode: UNPROCESSABLE_ENTITY,
          message: "Fields validation error",
          data: validator.errors,
        });

      // Extract data
      const { username, name, email, password, confirmPassword } = req.body;

      //User already exist
      const exitUsername = await User.findOne({ username }).exec();
      const emailUsername = await User.findOne({ email }).exec();
      if (exitUsername || emailUsername) {
        const existErrors = [];
        if (exitUsername) existErrors.push("El usuario ya existe.");
        if (emailUsername) existErrors.push("El correo electrónico ya existe.");

        return res.status(422).json({
          statusCode: UNPROCESSABLE_ENTITY,
          message: "User already exist",
          data: existErrors,
        });
      }

      // The password does not match
      if (password !== confirmPassword)
        return res.status(422).json({
          statusCode: UNPROCESSABLE_ENTITY,
          message: "The password does not match",
          data: ["La contraseña no coincide"],
        });

      const uuid = uuidv1();
      const user = new User({ uuid, name, username, email, password });
      await user.encryptPassword(password);

      const newUser = await user.save();
      const token = await generateAndSignToken({ user: { id: newUser.id } });

      res.status(200).json({
        statusCode: OK,
        message: "Successfully registered user",
        data: {
          user: newUser,
          meta: { token },
        },
      });
    } else {
      res.status(405).json({
        statusCode: METHOD_NOT_ALLOWED,
        message: "Method Not Allowed",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: INTERNAL_SERVER_ERROR,
      message: "Internal Server Error",
    });
  }
};
