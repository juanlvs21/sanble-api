const ENV: NodeJS.ProcessEnv = process.env;

export const LOG_MODE = process.env.LOG_MODE || "dev";
export const PORT = process.env.PORT || 4000;

export const FIREBASE_PROJECT_ID = ENV.FIREBASE_PROJECT_ID || "";
export const FIREBASE_PRIVATE_KEY = ENV.FIREBASE_PRIVATE_KEY || "";
export const FIREBASE_CLIENT_EMAIL = ENV.FIREBASE_CLIENT_EMAIL || "";

export const SENDGRID_KEY = ENV.SENDGRID_KEY || "";
export const SENDGRID_DOMAIN = ENV.SENDGRID_DOMAIN || "";
