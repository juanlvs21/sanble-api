import { check } from "express-validator";
import { validate } from "../middlewares/validator.middleware";

const lengthMax = 500;

const formReview = [
  check("stars", "Las estrellas son requeridas")
    .notEmpty()
    .isInt({ min: 1, max: 5 })
    .withMessage(`Las estrellas deben ser entre 1 y 5`),
  check("comment", `El comentario es requerido`)
    .notEmpty()
    .isLength({ max: lengthMax })
    .withMessage(`El comentario debe tener máximo ${lengthMax} caracteres`),
];

export const reviewValidator = validate(formReview);
