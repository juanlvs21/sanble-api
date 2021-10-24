import { check } from "express-validator";

export const signUpValidator = [
  check("username").not().isEmpty().withMessage("El usuario es requerido"),
  check("name").not().isEmpty().withMessage("El npmbre es requerido"),
  check("email")
    .isEmail()
    .withMessage("Ingrese una dirección de correo electrónico válida"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener minimo 6 caracteres"),
  check("confirmPassword").custom(async (confirmPassword, { req }) => {
    const password = req.body.password;
    if (password !== confirmPassword) {
      throw new Error("La contraseña no coincide");
    }
  }),
];

export const signInValidator = [
  check("username").not().isEmpty().withMessage("El usuario es requerido"),
  check("password").not().isEmpty().withMessage("La contraseña es requerida"),
];
