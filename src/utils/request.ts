import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import formidable, { File } from "formidable";

import { IFormidableFiles } from "../interfaces/IFile";

export const parseFormData = async (
  req: Request<ParamsDictionary, any, any, Record<string, any>>
): Promise<IFormidableFiles> => {
  const form = formidable({ multiples: false });

  return await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, filesParse) => {
      if (err) {
        reject(err);
        return;
      }

      const files = Object.values(filesParse) as File[];

      resolve({
        ...fields,
        files,
      });
    });
  });
};
