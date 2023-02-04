import { check } from "express-validator";

import { validate } from "../middlewares/validator.middleware";
import { parseFormData } from "../utils/request";

const lengthMax = 500;

const formFairPhotograph = [
  check("image").custom(async (_value, { req }) => {
    const parse: any = await parseFormData(req as any);

    if (!parse.files.length) {
      throw new Error("La fotografía es requerida");
    }

    if (
      !["image/png", "image/jpg", "image/jpeg"].includes(
        parse.files[0].mimetype
      )
    ) {
      throw new Error("Los tipos de archivos permitidos son jpg, png, jpeg");
    }

    if (parse.files[0].size > 1000000) {
      throw new Error("El tamaño máximo del archivo es de 10MB");
    }

    return true;
  }),
  check("description").custom(async (_value, { req }) => {
    const parse: any = await parseFormData(req as any);

    if (!parse.description) {
      throw new Error("La descripción es requerida");
    }

    if (parse.description.length > lengthMax) {
      throw new Error(
        `La descripción debe tener máximo ${lengthMax} caracteres`
      );
    }

    return true;
  }),
];

export const fairPhotographValidator = validate(formFairPhotograph);
