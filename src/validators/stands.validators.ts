import { check } from "express-validator";

import { EFairType } from "../interfaces/IFair";
import { validate } from "../middlewares/validator.middleware";

const lengthMaxLong = 500;
const lengthMaxShort = 40;
const lengthMaxPhone = 10;

const formStand = [
  check("name", "El nombre del stand es requerido")
    .isString()
    .notEmpty()
    .isLength({ max: lengthMaxShort })
    .withMessage(
      `El nombre del stand debe tener máximo ${lengthMaxShort} caracteres`
    ),
  check("description", "La descripción del stand es requerida")
    .isString()
    .notEmpty()
    .isLength({ max: lengthMaxLong })
    .withMessage(
      `La descripción del stand debe tener máximo ${lengthMaxLong} caracteres`
    ),
  check("contactEmail", "El correo electrónico de contacto es inválido")
    .optional({ checkFalsy: true })
    .isEmail()
    .isLength({ max: lengthMaxShort })
    .withMessage(
      `El correo electrónico de contacto debe tener máximo ${lengthMaxShort} caracteres`
    ),
  check("contactPhone", "El teléfono de contacto es requerido")
    .isString()
    .notEmpty()
    .isLength({ min: lengthMaxPhone, max: lengthMaxPhone })
    .withMessage(
      `El teléfono de contacto debe tener ${lengthMaxShort} caracteres`
    ),
  check("slogan")
    .optional({ checkFalsy: true })
    .isString()
    .isLength({ max: lengthMaxLong })
    .withMessage(`El slogan debe tener máximo ${lengthMaxLong} caracteres`),
];

export const standValidator = validate(formStand);
