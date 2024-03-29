import fs from "fs";
import ImageKit from "imagekit";
import { FileObject, UploadResponse } from "imagekit/dist/libs/interfaces";
import IKResponse from "imagekit/dist/libs/interfaces/IKResponse";
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

    console.info("imagekit.upload data: ", {
      filepath: file.filepath,
      fileName: name,
      folder,
    });

    imagekit
      .upload({
        file: fs.createReadStream(file.filepath),
        fileName: name,
        folder,
      })
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

export const listFiles = async (
  path: string
): Promise<IKResponse<FileObject[]>> => {
  return await new Promise((resolve, reject) => {
    imagekit
      .listFiles({
        path,
      })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
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
