import { dayjs } from "../../utils/time";

export function testTask() {
  process.stdout.write(
    `⏱️ Running a task every 10 minute ${dayjs().format("DD/MM/YYYY HH:mm")} \n`
  );
}
