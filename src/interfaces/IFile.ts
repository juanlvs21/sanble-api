import { File } from "formidable";

export enum EFolderName {
  "USERS" = "users",
  "FAIRS" = "fairs",
  "STANDS" = "stands",
  "PRODUCTS" = "products",
}

export interface IFormidableFiles extends Record<string, File[]> {}

export interface IFileUploadInput {
  file: File;
  mimetype: string;
  fileName?: string;
  folder?: string;
}
