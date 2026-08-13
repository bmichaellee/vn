import { StatusMap, t } from "elysia";

const usersTags = ["Users"];

const userSchema = t.Object({
  id: t.String(),
  handle: t.String(),
});

export const getUserDocs = {
  params: t.Object({ id: t.String() }),
  response: {
    [StatusMap["OK"]]: userSchema,
    [StatusMap["Not Found"]]: t.Object({ error: t.String() }),
  },
  detail: {
    summary: "Get user",
    description: "Retrieves a single user by their ID.",
    tags: usersTags,
  },
};
