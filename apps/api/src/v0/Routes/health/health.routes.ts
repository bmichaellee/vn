import Elysia from "elysia";
import { AppService } from "@Services";
import { Database } from "@Database";
import { getHealthDocs } from "./health.routes.docs";

export const healthRoutes = new Elysia({
  prefix: "/health",
}).get(
  "/",
  async ({ set }) => {
    const version = AppService.getVersion();
    const database = await Database.getConnectionStatus().then((status) =>
      status ? "ok" : "error",
    );

    if (database === "error") set.status = "Service Unavailable";

    return { version, database };
  },
  getHealthDocs,
);
