import dayjs from "dayjs";

import { IPhotograph, IPhotographForm } from "../interfaces/IPhotograph";

const lengthMax = 500;
const fileMax10MB = 10000000;

export const validPhotographForm = (form: IPhotographForm) => {
  const errors: string[] = [];

  const { description, id } = form;
  const file = form.files[0] || null;

  if (!description) {
    errors.push("La descripción es requerida");
  } else {
    if (description.length > lengthMax) {
      errors.push(`La descripción debe tener máximo ${lengthMax} caracteres`);
    }
  }

  if (!id) {
    if (!file) {
      errors.push("La fotografía es requerida");
    } else {
      if (
        !["image/png", "image/jpg", "image/jpeg"].includes(file?.mimetype || "")
      ) {
        errors.push("Los tipos de archivos permitidos son jpg, png, jpeg");
      }

      if (file.size > fileMax10MB) {
        errors.push("El tamaño máximo del archivo es de 10MB");
      }
    }
  }

  return errors;
};

export const photographFormat = ({
  fileId,
  creationTimestamp,
  ...rest
}: IPhotograph): Omit<IPhotograph, "fileId"> => ({
  ...rest,
  creationTime: dayjs((creationTimestamp?.seconds || 0) * 1000).format(),
});
