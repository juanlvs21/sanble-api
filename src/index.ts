import app from "./app";

async function init() {
  app.listen(app.get("port"));
  // console.log("🚀 Server on port:", app.get("port"));
  process.stdout.write(`🚀 Server on port: ${app.get("port")} \n`);
}

init();
