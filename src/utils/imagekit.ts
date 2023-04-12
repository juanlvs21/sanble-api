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
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

const imagekit = new ImageKit({
  publicKey: IMAGEKIT_PUBLIC_KEY,
  privateKey: IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: IMAGEKIT_URL_ENDPOINT,
});

export const uploadFile = async ({
  file,
  mimetype,
  fileName,
  folder,
}: IFileUploadInput): Promise<UploadResponse> => {
  return await new Promise((resolve, reject) => {
    let name = "";

    if (fileName) name = fileName;
    else name = `${uuidv4()}.${EXTENSION_FILE[mimetype]}`;

    const uploadData = {
      file: fs.createReadStream(file.filepath),
      fileName: name,
      folder,
    };

    console.info("imagekit.upload data: ", uploadData);

    imagekit
      .upload(uploadData)
      .then((response) => {
        console.info("imagekit.upload sucess: ", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("imagekit.upload error: ", error);
        reject(error);
      });
  });
};

export const deleteFile = async (fileId: string) => {
  return await new Promise((resolve, reject) => {
    imagekit
      .deleteFile(fileId)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
