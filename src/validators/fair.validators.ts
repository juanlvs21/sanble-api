import { check } from "express-validator";

import { validate } from "../middlewares/validator.middleware";
import { parseFormData } from "../utils/request";

const lengthMax = 500;

const formFairPhotograph = [
  check("image").custom(async (_value, { req }) => {
    const parse: any = await parseFormData(req as any);
    let error = "";

    if (!parse.files.length) error = "La fotografía es requerida";

    if (
      !["image/png", "image/jpg", "image/jpeg"].includes(
        parse.files[0].mimetype
      )
    ) {
      error = "Los tipos de archivos permitidos son jpg, png, jpeg";
    }

    if (parse.files[0].size > 1000000) {
      error = "El tamaño máximo del archivo es de 10MB";
    }

    if (error) return Promise.reject(error);
    else return Promise.resolve("Fotografía válida");
  }),
  check("description").custom(async (_value, { req }) => {
    const parse: any = await parseFormData(req as any);
    let error = "";

    if (!parse.description) {
      error = "La descripción es requerida";
    }

    if (parse.description.length > lengthMax) {
      error = `La descripción debe tener máximo ${lengthMax} caracteres`;
    }

    if (error) throw new Error(error);
    else return true;
  }),
];

export const fairPhotographValidator = validate(formFairPhotograph);
