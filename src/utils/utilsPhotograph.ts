import dayjs from "dayjs";

import { IPhotograph, IPhotographForm } from "../interfaces/IPhotograph";

const lengthMax = 500;
const fileMax10MB = 10000000;

const validPhotographBase = (form: IPhotographForm) => {
  const errors: string[] = [];

  const { description } = form;

  if (!description) {
    errors.push("La descripción es requerida");
  } else {
    if (description.length > lengthMax) {
      errors.push(`La descripción debe tener máximo ${lengthMax} caracteres`);
    }
  }

  return errors;
};

const validPhotographFile = (form: IPhotographForm) => {
  const errors: string[] = [];

  const file = form.files[0] || null;

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

  return errors;
};

export const validPhotographForm = (
  form: IPhotographForm,
  requiredPhoto = true
) => {
  let errors: string[] = [];

  errors = validPhotographBase(form);

  if (requiredPhoto) {
    errors = validPhotographFile(form);
  } else {
    if (form.files.length) {
      errors = validPhotographFile(form);
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
