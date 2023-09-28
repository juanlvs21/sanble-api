import { config } from "dotenv";

config();

const ENV: NodeJS.ProcessEnv = process.env;

export const IS_PROD = ENV.NODE_ENV !== "development";
export const PORT = ENV.PORT || 4000;
export const JWT_SECRET = ENV.JWT_SECRET || "secretword";
export const SENDGRID_API_KEY = ENV.SENDGRID_API_KEY || "";

export const FIREBASE_PROJECT_ID = ENV.FIREBASE_PROJECT_ID || "";
export const FIREBASE_CLIENT_EMAIL = ENV.FIREBASE_CLIENT_EMAIL || "";
export const FIREBASE_PRIVATE_KEY = ENV.FIREBASE_PRIVATE_KEY
  ? ENV.FIREBASE_PRIVATE_KEY.replace(/\\n/gm, "\n")
  : undefined;

export const IMAGEKIT_PUBLIC_KEY = ENV.IMAGEKIT_PUBLIC_KEY || "";
export const IMAGEKIT_PRIVATE_KEY = ENV.IMAGEKIT_PRIVATE_KEY || "";
export const IMAGEKIT_URL_ENDPOINT = ENV.IMAGEKIT_URL_ENDPOINT || "";

export const HEALTHCHECK_URL = ENV.HEALTHCHECK_URL || "";
