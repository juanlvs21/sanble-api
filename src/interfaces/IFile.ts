import { File } from "formidable";

export enum EExtensionFile {
  "image/png" = "png",
}

export interface IFormidableFiles extends Record<string, File[]> {}

export interface IFileUploadInput {
  file: File;
  mimetype: string;
  fileName?: string;
}
