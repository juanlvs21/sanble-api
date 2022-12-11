import cron from "node-cron";

import { testTask } from "./tasks/test";

export function runCronjobs() {
  cron.schedule("*/10 * * * *", testTask);
}
