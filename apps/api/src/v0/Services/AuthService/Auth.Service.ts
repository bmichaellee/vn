import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

import { eq } from "drizzle-orm";

import { Database } from "@Database";
import { sessionsSchema, usersSchema } from "@Schema";

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export type Session = NonNullable<
  Awaited<ReturnType<typeof AuthService.login>>
>;

export class AuthService {
  static hashPassword(password: string) {
    const salt = randomBytes(16).toString("hex");
    const key = scryptSync(password, salt, 64).toString("hex");

    return `${salt}:${key}`;
  }

  static verifyPassword(password: string, passwordHash: string) {
    const [salt, key] = passwordHash.split(":");

    if (!salt || !key) {
      return false;
    }

    const stored = Buffer.from(key, "hex");
    const candidate = scryptSync(password, salt, stored.length);

    return timingSafeEqual(candidate, stored);
  }

  static async login(handle: string, password: string) {
    const [user] = await Database.instance
      .select()
      .from(usersSchema)
      .where(eq(usersSchema.handle, handle));

    if (!user || !this.verifyPassword(password, user.passwordHash)) {
      return null;
    }

    const [session] = await Database.instance
      .insert(sessionsSchema)
      .values({
        userId: user.id,
        expiresAt: new Date(Date.now() + SESSION_TTL_MS),
      })
      .returning();

    return {
      id: session.id,
      expiresAt: session.expiresAt,
      user: { id: user.id, handle: user.handle },
    };
  }

  static async getSession(sessionId?: string) {
    if (!sessionId) {
      return null;
    }

    const [row] = await Database.instance
      .select()
      .from(sessionsSchema)
      .innerJoin(usersSchema, eq(sessionsSchema.userId, usersSchema.id))
      .where(eq(sessionsSchema.id, sessionId));

    if (!row || row.sessions.expiresAt.getTime() <= Date.now()) {
      return null;
    }

    return {
      id: row.sessions.id,
      expiresAt: row.sessions.expiresAt,
      user: { id: row.users.id, handle: row.users.handle },
    };
  }
}
