import { check } from "express-validator";
import { validate } from "../middlewares/validator.middleware";

const passMin = 8;
const lengthMax = 40;

const formSignup = [
  check("name", "Ingrese su nombre.")
    .not()
    .isEmpty()
    .isLength({ max: lengthMax })
    .withMessage(`El nombre debe tener máximo ${lengthMax} caracteres`),
  check("email", "Ingrese su correo electrónico")
    .isEmail()
    .isLength({ max: lengthMax })
    .withMessage(
      "El correo electrónico debe tener máximo ${lengthMax} caracteres"
    ),
  check("password", `La contraseña debe tener minimo ${passMin} caracteres`)
    .not()
    .isEmpty()
    .isLength({ min: passMin, max: lengthMax })
    .withMessage(
      `La contraseña debe tener mínimo ${passMin} y máximo ${lengthMax} caracteres`
    ),
];

const formSignin = [
  check("email", "Ingrese su nombre de dirección de correo electrónico")
    .not()
    .isEmpty(),
  check("password", "Ingrese su contraseña").not().isEmpty(),
];

export const signUpValidator = validate(formSignup);
export const signInValidator = validate(formSignin);
