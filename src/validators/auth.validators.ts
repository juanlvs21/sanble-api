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

const formSignin = [
  check("email", "La dirección de correo electrónico es requerida")
    .not()
    .isEmpty(),
  check("password", "La contraseña es requerida").not().isEmpty(),
];

const formsignInExternal = [
  check("email", "La dirección de correo electrónico es requerida")
    .not()
    .isEmpty(),
];

export const signUpValidator = validate(formSignup);
export const signInValidator = validate(formSignin);
export const signInExternalValidator = validate(formsignInExternal);
