import app from "./app";
import { runCronjobs } from "./cronjobs";

async function init() {
  app.listen(app.get("port"));
  process.stdout.write(`🚀 Server on port: ${app.get("port")} \n`);

  runCronjobs();
}

init();
