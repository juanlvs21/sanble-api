import fs from "fs";
import ImageKit from "imagekit";
import { UploadResponse } from "imagekit/dist/libs/interfaces";
import { v4 as uuidv4 } from "uuid";

import {
  IMAGEKIT_PRIVATE_KEY,
  IMAGEKIT_PUBLIC_KEY,
  IMAGEKIT_URL_ENDPOINT,
} from "../config/env";
import { IFileUploadInput } from "../interfaces/IFile";

export const EXTENSION_FILE: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpeg",
};

export const uploadFile = async ({
  file,
  mimetype,
  fileName,
}: IFileUploadInput): Promise<UploadResponse> => {
  const imagekit = new ImageKit({
    publicKey: IMAGEKIT_PUBLIC_KEY,
    privateKey: IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: IMAGEKIT_URL_ENDPOINT,
  });

  return await new Promise((resolve, reject) => {
    let name = "";

    if (fileName) name = fileName;
    else name = `${uuidv4()}.${EXTENSION_FILE[mimetype]}`;

    imagekit
      .upload({
        file: fs.createReadStream(file.filepath),
        fileName: name,
      })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
