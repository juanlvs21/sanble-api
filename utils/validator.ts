import validator from "validator";

const fields = {
  username: "Usuario",
  name: "Nombre",
  email: "Correo electrónico",
  password: "Contraseña",
  confirmPassword: "Confirmar contraseña",
};

const messageReturn = (
  type: string,
  field: string = "field",
  value: string | number = null
) => {
  const messages = {
    required: `El campo ${fields[field]} es requerido.`,
    validM: `Debe ingresar un ${fields[field]} válido.`,
    validF: `Debe ingresar una ${fields[field]} válida.`,
    min: `El campo ${fields[field]} debe tener mínimo ${value} caracteres.`,
    max: `El campo ${fields[field]} debe tener máximo ${value} caracteres.`,
    password: `La contraseña debe contener 8 caracteres, 1 mayuscula, 1 numero y 1 símbolo.`,
  };

  return messages[type];
};

const invalidBody = (rules: object) => {
  return Object.keys(rules).map((field: string) =>
    messageReturn("required", field)
  );
};

class Validators {
  required({ field, object }) {
    let valid: boolean = true;

    if (!object.hasOwnProperty(field)) valid = false;

    return {
      valid,
      message: messageReturn("required", field),
    };
  }
  min({ field, value, min }) {
    let valid: boolean = true;
    if (value.length < min) valid = false;
    return {
      valid,
      message: messageReturn("min", field, min),
    };
  }
  email({ field, value }) {
    let valid: boolean = true;
    if (
      !validator.matches(
        value,
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    )
      valid = false;
    return {
      valid,
      message: messageReturn("validM", field),
    };
  }
  password({ field, value }) {
    let valid: boolean = true;
    if (!validator.isStrongPassword(value)) valid = false;

    return {
      valid,
      message: messageReturn("password"),
    };
  }
}

const prepareRule = (val: string) => {
  const rule = val.split(":")[0];
  const value = val.split(":")[1];
  let data: any = {};

  if (rule === "min") data.min = value;
  if (rule === "max") data.max = value;

  return data;
};

export const valid = (body: object, rules: object) => {
  let errors = [];

  if (typeof body == "object" && Object.keys(body).length !== 0) {
    // Username
    for (let i = 0; i < Object.keys(rules).length; i++) {
      const v = new Validators();
      const field: string = Object.keys(rules)[i];

      const required = v.required({ field, object: body });
      if (required.valid) {
        rules[field].map((rule: string) => {
          const method = rule.split(":")[0];
          const { valid, message } = v[method]({
            field: field,
            value: body[field],
            object: body,
            ...prepareRule(rule),
          });

          if (!valid) errors.push(message);
        });
      }
    }
  } else errors = invalidBody(rules);

  return {
    valid: !errors.length,
    errors,
  };
};
