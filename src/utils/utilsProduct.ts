import dayjs from "dayjs";

import {
  IProductForm,
  EProductCurrency,
  EProductTypeKey,
  IProduct,
} from "../interfaces/IProduct";

const lengthMaxName = 500;
const lengthMaxDescription = 500;
const fileMax10MB = 10000000;

const validProductBase = (form: IProductForm) => {
  const errors: string[] = [];

  const { name, description, price, currency, type } = form;

  if (!name) {
    errors.push("El nombre del producto es requerido");
  } else {
    if (name.length > lengthMaxName) {
      errors.push(
        `El nombre del producto debe tener máximo ${lengthMaxName} caracteres`
      );
    }
  }

  if (!description) {
    errors.push("La descripción del producto es requerida");
  } else {
    if (description.length > lengthMaxDescription) {
      errors.push(
        `La descripción del producto debe tener máximo ${lengthMaxDescription} caracteres`
      );
    }
  }

  if (!price) {
    errors.push("El precio del producto es requerido");
  } else {
    if (/^\$?(([1-9]\d{0,2}(,\d{3})*)|0)?\.\d{1,2}$/.test(price)) {
      errors.push(`El precio del producto es inválido`);
    }
  }

  if (!currency) {
    errors.push("La moneda del producto es requerida");
  } else {
    if (![EProductCurrency.BS, EProductCurrency.USD].includes(currency)) {
      errors.push("La moneda del producto es inválida");
    }
  }

  if (!currency) {
    errors.push("La moneda del producto es requerida");
  } else {
    if (![EProductCurrency.BS, EProductCurrency.USD].includes(currency)) {
      errors.push("La moneda del producto es inválida");
    }
  }

  if (!type) {
    errors.push("El tipo del producto es requerido");
  } else {
    if (
      ![
        EProductTypeKey.CLOTHES,
        EProductTypeKey.ACCESSORIES,
        EProductTypeKey.DRINKS,
        EProductTypeKey.CANDIES,
        EProductTypeKey.FOODS,
      ].includes(type)
    ) {
      errors.push("El tipo del producto es inválido");
    }
  }

  return errors;
};

export const validProductPhotoFile = (form: IProductForm) => {
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

export const validProductForm = (form: IProductForm): string[] => {
  let errors: string[] = [];

  errors = validProductBase(form);

  if (form.files.length) {
    errors = validProductPhotoFile(form);
  }

  return errors;
};

export const productFormat = ({
  fileId,
  creationTimestamp,
  ...rest
}: IProduct): Omit<IProduct, "fileId"> => ({
  ...rest,
  creationTime: dayjs((creationTimestamp?.seconds || 0) * 1000).format(),
});
