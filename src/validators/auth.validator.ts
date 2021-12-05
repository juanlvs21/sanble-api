import { check } from "express-validator";

export const signUpValidator = [
  check("name").not().isEmpty().withMessage("El nombre es requerido"),
  check("email")
    .isEmail()
    .withMessage("Ingrese una dirección de correo electrónico válida"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener minimo 6 caracteres"),
];

export const signInValidator = [
  check("username").not().isEmpty().withMessage("El usuario es requerido"),
  check("password").not().isEmpty().withMessage("La contraseña es requerida"),
];
