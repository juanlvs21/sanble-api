import { check } from "express-validator";
import { validate } from "../middlewares/validator.middleware";

const passMin = 8;
const lengthMax = 40;

const formSignup = [
  check("name", "El nombre es requerido")
    .notEmpty()
    .isLength({ max: lengthMax })
    .withMessage(`El nombre debe tener máximo ${lengthMax} caracteres`),
  check("email", "El correo electrónico es requerido")
    .isEmail()
    .isLength({ max: lengthMax })
    .withMessage(
      `El correo electrónico debe tener máximo ${lengthMax} caracteres`
    ),
  check(
    "password",
    `La contraseña debe tener mínimo ${passMin} y máximo ${lengthMax} caracteres`
  )
    .notEmpty()
    .isLength({ min: passMin, max: lengthMax })
    .withMessage(
      `La contraseña debe tener mínimo ${passMin} y máximo ${lengthMax} caracteres`
    ),
];

const updateUser = [
  check("displayName", "El nombre es requerido")
    .notEmpty()
    .isLength({ max: lengthMax })
    .withMessage(`El nombre debe tener máximo ${lengthMax} caracteres`),
  check("email", "El correo electrónico es requerido")
    .isEmail()
    .isLength({ max: lengthMax })
    .withMessage(
      `El correo electrónico debe tener máximo ${lengthMax} caracteres`
    ),
  check("phoneNumber").isString().optional(),
];

const changePassword = [
  check(
    "password",
    `La nueva contraseña debe tener mínimo ${passMin} y máximo ${lengthMax} caracteres`
  )
    .notEmpty()
    .isLength({ min: passMin, max: lengthMax })
    .withMessage(
      `La nueva contraseña debe tener mínimo ${passMin} y máximo ${lengthMax} caracteres`
    ),
];

const recoveryPassword = [
  check("email", "El correo electrónico es requerido")
    .isEmail()
    .isLength({ max: lengthMax })
    .withMessage(
      `El correo electrónico debe tener máximo ${lengthMax} caracteres`
    ),
];

export const signUpValidator = validate(formSignup);
export const updateUserValidator = validate(updateUser);
export const changePasswordValidator = validate(changePassword);
export const recoveryPasswordValidator = validate(recoveryPassword);
