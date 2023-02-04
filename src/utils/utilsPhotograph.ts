import { IPhotographForm } from "../interfaces/IPhotograph";

const lengthMax = 500;

export const validPhotographForm = (form: IPhotographForm) => {
  const errors: string[] = [];

  const description = form.description;
  const file = form.files[0] || null;

  if (!description) {
    errors.push("La descripción es requerida");
  } else {
    if (description.length > lengthMax) {
      errors.push(`La descripción debe tener máximo ${lengthMax} caracteres`);
    }
  }

  if (!file) {
    errors.push("La fotografía es requerida");
  } else {
    if (
      !["image/png", "image/jpg", "image/jpeg"].includes(file?.mimetype || "")
    ) {
      errors.push("Los tipos de archivos permitidos son jpg, png, jpeg");
    }

    if (file.size > 1000000) {
      errors.push("El tamaño máximo del archivo es de 10MB");
    }
  }

  return errors;
};
