import app from "./app";
import { makeConnection } from "./config/database";

async function init() {
  await makeConnection();
  app.listen(app.get("port"));
  // console.log("🚀 Server on port:", app.get("port"));
  process.stdout.write(`🚀 Server on port: ${app.get("port")}`);
}

init();
