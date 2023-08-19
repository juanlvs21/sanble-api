import dayjs from "dayjs";

import { IPost, IPostForm } from "../interfaces/IPost";

const lengthMax = 500;
const fileMax10MB = 10000000;

const validPostBase = (form: IPostForm) => {
  const errors: string[] = [];

  const { text } = form;

  if (!text) {
    errors.push("El texto de la pubicación es requerida");
  } else {
    if (text.length > lengthMax) {
      errors.push(
        `El texto de la pubicación debe tener máximo ${lengthMax} caracteres`
      );
    }
  }

  return errors;
};

export const validPostPhotoFile = (form: IPostForm) => {
  const errors: string[] = [];

  const file = form.files[0] || null;

  if (file) {
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

export const validPostForm = (form: IPostForm) => {
  let errors: string[] = [];

  errors = validPostBase(form);

  if (form.files.length) {
    errors = validPostPhotoFile(form);
  }

  return errors;
};

export const postFormat = ({
  fileId,
  creationTimestamp,
  ...rest
}: IPost): Omit<IPost, "fileId"> => ({
  ...rest,
  creationTime: dayjs((creationTimestamp?.seconds || 0) * 1000).format(),
});
