const ENV: NodeJS.ProcessEnv = process.env;

export const MONGODB_URI = ENV.MONGODB_URI || "mongodb://localhost/dofusturas";
export const JWT_SECRET = ENV.JWT_SECRET || "somesecret";
export const TOKEN_EXPIRY_TIME = ENV.TOKEN_EXPIRY_TIME || "1h";
export const FIREBASE_API_KEY = ENV.FIREBASE_API_KEY || "";
export const FIREBASE_AUTH_DOMAIN = ENV.FIREBASE_AUTH_DOMAIN || "";
export const FIREBASE_PROJECT_ID = ENV.FIREBASE_PROJECT_ID || "";
export const FIREBASE_STORAGE_BUCKET = ENV.FIREBASE_STORAGE_BUCKET || "";
export const FIREBASE_MESSAGING_SENDER_ID =
  ENV.FIREBASE_MESSAGING_SENDER_ID || "";
export const FIREBASE_APP_ID = ENV.FIREBASE_APP_ID || "";
export const FIREBASE_MEASUREMENT_ID = ENV.FIREBASE_MEASUREMENT_ID || "";
