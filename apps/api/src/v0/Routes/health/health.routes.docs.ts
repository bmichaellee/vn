import { StatusMap, t } from "elysia";

const healthTags = ["System"];

export const getHealthDocs = {
  response: {
    [StatusMap["OK"]]: t.Object({
      version: t.String(),
      database: t.Literal("ok"),
    }),
    [StatusMap["Service Unavailable"]]: t.Object({
      version: t.String(),
      database: t.Literal("error"),
    }),
  },
  detail: {
    summary: "Health check",
    description:
      "Returns the API version and the current database connection status.",
    tags: healthTags,
  },
};
