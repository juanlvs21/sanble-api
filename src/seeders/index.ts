import { usersSeeder } from "./users.seeder";

async function init() {
  await usersSeeder();
}

init();
