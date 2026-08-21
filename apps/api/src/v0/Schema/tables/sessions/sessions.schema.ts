import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

import { usersSchema } from "../users";

export const sessionsSchema = pgTable("sessions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid(10)),
  userId: text("user_id")
    .notNull()
    .references(() => usersSchema.id),
  expiresAt: timestamp("expires_at").notNull(),
});
