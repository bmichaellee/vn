import { treaty } from "@elysiajs/eden";
import type { App } from "@vn/api";

const api = treaty<App>("localhost");

export type HealthResponse = NonNullable<
  Awaited<ReturnType<typeof api.v0.health.get>>["data"]
>;
