import "module-alias/register";
import { config } from "dotenv";
config();

import app from "@/app";
import { makeConnection } from "@/config/mongoose";

async function main() {
  await makeConnection();
  app.listen(app.get("port"));
  console.log(`Server on port ${app.get("port")}🚀`);
}

main();
