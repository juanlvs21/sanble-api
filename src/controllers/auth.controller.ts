import { validationResult } from "express-validator";

import { OK, UNAUTHORIZED, UNPROCESSABLE_ENTITY } from "http-status";

// Models
import User from "@/models/User";

// Error
import { ErrorHandler } from "@/error";

// Config
import { TOKEN_EXPIRY_TIME } from "@/config";

// Utils
import { generateAndSignToken } from "@/utils/auth";

export const login: Handler = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    throw new ErrorHandler(UNPROCESSABLE_ENTITY, errors.array());

  const { username, password } = req.body;

  // Validate credentials
  const user = await User.findOne({ username }).exec();
  if (!user)
    throw new ErrorHandler(UNAUTHORIZED, "Usuario o contraseña incorrecto.");

  // Compare password
  const passwordCorrect: boolean = await user.comparePassword(password);
  if (!passwordCorrect)
    throw new ErrorHandler(UNAUTHORIZED, "Usuario o contraseña incorrecto.");

  const token = await generateAndSignToken({ user: { id: user.id } });

  const data = {
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
    meta: {
      token,
      expiresIn: TOKEN_EXPIRY_TIME,
    },
  };

  return res.status(OK).json({
    statusCode: OK,
    message: "Successful authentication",
    data,
  });
};
