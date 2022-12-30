import { check } from "express-validator";
import { validate } from "../middlewares/validator.middleware";

const passMin = 8;
const lengthMax = 40;

const formSignup = [
  check("name", "El nombre es requerido")
    .not()
    .isEmpty()
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
    .not()
    .isEmpty()
    .isLength({ min: passMin, max: lengthMax })
    .withMessage(
      `La contraseña debe tener mínimo ${passMin} y máximo ${lengthMax} caracteres`
    ),
];

export const signUpValidator = validate(formSignup);
