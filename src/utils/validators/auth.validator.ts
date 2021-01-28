import { check } from "express-validator";

export const logInValidator = [
  check("username")
    .not()
    .isEmpty()
    .withMessage("El nombre de usuario es requerido"),
  check("password")
    .not()
    .isEmpty()
    .withMessage("El la contraseña es requerido"),
];
