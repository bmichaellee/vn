import { StatusMap, t } from "elysia";

const authTags = ["Auth"];

export const loginDocs = {
  body: t.Object({
    handle: t.String(),
    password: t.String(),
  }),
  response: {
    [StatusMap["OK"]]: t.Object({
      user: t.Object({
        id: t.String(),
        handle: t.String(),
      }),
    }),
    [StatusMap["Unauthorized"]]: t.Object({ error: t.String() }),
  },
  detail: {
    summary: "Log in",
    description:
      "Verifies handle and password, creates a session, and sets an httpOnly session cookie.",
    tags: authTags,
  },
};

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
