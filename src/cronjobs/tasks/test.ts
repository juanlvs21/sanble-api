import fetch from "cross-fetch";

import { HEALTHCHECK_URL } from "../../config/env";

export async function testTask() {
  const response = await fetch(HEALTHCHECK_URL);

  try {
    if (response.ok) process.stdout.write("API HealthCheck - Success");
    else process.stdout.write("API HealthCheck - Error");
  } catch (error) {
    process.stdout.write("API HealthCheck - Error");
  }
}
