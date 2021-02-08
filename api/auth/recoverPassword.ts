import { NowRequest, NowResponse } from "@vercel/node";
import {
  OK,
  METHOD_NOT_ALLOWED,
  UNPROCESSABLE_ENTITY,
  INTERNAL_SERVER_ERROR,
} from "http-status";

// Utils
import { auth } from "../../utils/firebase";
import { valid } from "../../utils/validator";
import { recoverPasswordEmail } from "../../utils/sgMain";

export default async (req: NowRequest, res: NowResponse) => {
  try {
    if (req.method === "OPTIONS") {
      res.status(OK).end();
    } else if (req.method === "POST") {
      const body =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body;

      const validator = await valid(body, {
        email: ["required", "email"],
      });
      if (!validator.valid)
        return res.status(UNPROCESSABLE_ENTITY).json({
          statusCode: UNPROCESSABLE_ENTITY,
          message: "Fields validation error",
          data: validator.errors,
        });

      // Extract data
      const { email } = body;

      const user = await auth.getUserByEmail(email);

      const passwordResetLink: string = await auth.generatePasswordResetLink(
        email
      );

      await recoverPasswordEmail(
        user.email,
        user.displayName,
        passwordResetLink
      );

      res.status(OK).json({
        statusCode: OK,
        message: "Password recovery email sent successfully",
        data: [
          "Correo electrónico de recuperación de contraseña enviado satisfactoriamente.",
        ],
      });
    } else {
      res.status(METHOD_NOT_ALLOWED).json({
        statusCode: METHOD_NOT_ALLOWED,
        message: "Method Not Allowed",
      });
    }
  } catch (error) {
    console.error(error);

    if (error.errorInfo) {
      if (error.errorInfo.code === "auth/user-not-found")
        return res.status(UNPROCESSABLE_ENTITY).json({
          statusCode: UNPROCESSABLE_ENTITY,
          message: "Firebase:auth/user-not-found",
          data: ["Dirección de correo electrónico no registrada."],
        });
    } else {
      return res.status(INTERNAL_SERVER_ERROR).json({
        statusCode: INTERNAL_SERVER_ERROR,
        message: "Internal Server Error",
      });
    }
  }
};
