import { StatusMap, t } from "elysia";

const authTags = ["Auth"];

export const getSessionDocs = {
  response: {
    [StatusMap["OK"]]: t.Object({
      session: t.Nullable(t.Unknown()),
    }),
  },
  detail: {
    summary: "Current session",
    description:
      "Returns whether the request carries an authenticated session.",
    tags: authTags,
  },
};
