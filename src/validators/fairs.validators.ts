import { check } from "express-validator";

import { EFairType } from "../interfaces/IFair";
import { validate } from "../middlewares/validator.middleware";

const lengthMaxLong = 500;
const lengthMaxShort = 40;
const lengthMaxPhone = 10;

const formFairs = [
  check("name", "El nombre de la feria es requerido")
    .isString()
    .notEmpty()
    .isLength({ max: lengthMaxShort })
    .withMessage(
      `El nombre de la feria debe tener máximo ${lengthMaxShort} caracteres`
    ),
  check("description", "La descripción de la feria es requerida")
    .isString()
    .notEmpty()
    .isLength({ max: lengthMaxLong })
    .withMessage(
      `La descripción de la feria debe tener máximo ${lengthMaxLong} caracteres`
    ),
  check("type", "El tipo de feria es requerido")
    .isString()
    .notEmpty()
    .isIn([EFairType.ENTREPRENEURSHIP, EFairType.GASTRONOMIC])
    .withMessage(
      `El tipo de feria debe ser "Gastronónica" o de "Emprendimiento"`
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
  check("celebrationDate", "La fecha de celebración debe ser un texto")
    .isString()
    .optional(),
  check("address", "La dirección es requerida")
    .isString()
    .notEmpty()
    .isLength({ max: lengthMaxLong })
    .withMessage(`La dirección debe tener máximo ${lengthMaxLong} caracteres`),
];

export const fairsValidator = validate(formFairs);
