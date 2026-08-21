import { StatusMap, t } from "elysia";

const authTags = ["Auth"];

const sessionResponse = t.Object({
  id: t.String(),
  expiresAt: t.String(),
  user: t.Object({
    id: t.String(),
    handle: t.String(),
  }),
});

export const loginDocs = {
  body: t.Object({
    handle: t.String(),
    password: t.String(),
  }),
  response: {
    [StatusMap["OK"]]: t.Object({
      session: sessionResponse,
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
  cookie: t.Cookie({ session: t.Optional(t.String()) }),
  response: {
    [StatusMap["OK"]]: t.Object({
      session: t.Nullable(sessionResponse),
    }),
  },
  detail: {
    summary: "Current session",
    description:
      "Returns whether the request carries an authenticated session.",
    tags: authTags,
  },
};
