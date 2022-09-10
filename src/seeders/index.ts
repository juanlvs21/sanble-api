import { makeConnection } from "../config/database";

import { usersSeeder } from "./users.seeder";

async function init() {
  await makeConnection();

  await usersSeeder();
}

init();
