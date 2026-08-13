import { pgTable, text } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const usersSchema = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid(10)),
  handle: text("handle").notNull(),
});
