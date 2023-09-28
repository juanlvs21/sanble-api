import { check } from "express-validator";
import { validate } from "../middlewares/validator.middleware";

const tokenNotification = [
  check("token", "El token de notificación es requerido").isString().notEmpty(),
];

export const tokenNotificationValidator = validate(tokenNotification);
