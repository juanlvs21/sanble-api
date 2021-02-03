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
import { welcomeEmail } from "../../utils/sgMail";
import generateToken from "../../utils/generateToken";

// Models
import User from "../../models/User";

export default async (req: NowRequest, res: NowResponse) => {
  try {
    if (req.method === "POST") {
      await makeConnection(res); // Connected to the database

      const body =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body;

      const validator = await valid(body, {
        username: ["required", "min:4"],
        name: ["required"],
        email: ["required", "email"],
        password: ["required", "password"],
        confirmPassword: ["required"],
      });
      if (!validator.valid)
        return res.status(UNPROCESSABLE_ENTITY).json({
          statusCode: UNPROCESSABLE_ENTITY,
          message: "Fields validation error",
          data: validator.errors,
        });

      // Extract data
      const { username, name, email, password, confirmPassword } = body;

      //User already exist
      const exitUsername = await User.findOne({ username }).exec();
      const emailUsername = await User.findOne({ email }).exec();
      if (exitUsername || emailUsername) {
        const existErrors = [];
        if (exitUsername) existErrors.push("El usuario ya existe.");
        if (emailUsername) existErrors.push("El correo electrónico ya existe.");

        return res.status(UNPROCESSABLE_ENTITY).json({
          statusCode: UNPROCESSABLE_ENTITY,
          message: "User already exist",
          data: existErrors,
        });
      }

      // The password does not match
      if (password !== confirmPassword)
        return res.status(UNPROCESSABLE_ENTITY).json({
          statusCode: UNPROCESSABLE_ENTITY,
          message: "The password does not match",
          data: ["La contraseña no coincide"],
        });

      const uuid = uuidv1();
      const token_email_verified = generateToken();
      const user = new User({
        uuid,
        name,
        username,
        email,
        password,
        token_email_verified,
      });
      await user.encryptPassword(password);

      const newUser = await user.save();

      await welcomeEmail(
        newUser.email,
        newUser.name,
        token_email_verified
      ).catch(async (error: any) => {
        await User.deleteOne({ _id: newUser._id });
        throw new Error(
          typeof error === "string" ? error : JSON.stringify(error)
        );
      });

      const token = await generateAndSignToken({ user: { id: newUser.id } });

      res.status(OK).json({
        statusCode: OK,
        message: "Successfully registered user",
        data: {
          user: {
            url_avatar: newUser.url_avatar,
            is_active: newUser.is_active,
            is_admin: newUser.is_admin,
            email_verified_at: newUser.email_verified_at,
            uuid: newUser.uuid,
            name: newUser.name,
            username: newUser.username,
            email: newUser.email,
            createdAt: newUser.createdAt,
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
