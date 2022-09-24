import { config } from "dotenv";

config();

const ENV: NodeJS.ProcessEnv = process.env;

export const IS_PROD = ENV.NODE_ENV !== "development";
export const PORT = ENV.PORT || 4000;
export const JWT_SECRET = ENV.JWT_SECRET || "secretword";
export const SENDGRID_API_KEY = ENV.SENDGRID_API_KEY || "";
