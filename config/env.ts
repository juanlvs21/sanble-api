const ENV: NodeJS.ProcessEnv = process.env;

export const MONGODB_URI = ENV.MONGODB_URI || "mongodb://localhost/dofusturas";
export const JWT_SECRET = ENV.JWT_SECRET || "somesecret";
export const TOKEN_EXPIRY_TIME = ENV.TOKEN_EXPIRY_TIME || "1h";
