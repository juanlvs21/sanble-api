import { PORT } from "../config/env";

export const getAppDomain = (host: string): string => {
  return host.includes("localhost:") ? `http://localhost:${PORT}` : host;
};
