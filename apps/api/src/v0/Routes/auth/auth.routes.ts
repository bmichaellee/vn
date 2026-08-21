import Elysia from "elysia";

import { AuthService } from "@Services";

import { getSessionDocs, loginDocs, logoutDocs } from "./auth.routes.docs";

import type { Session } from "@Services";

const serializeSession = (session: Session) => ({
  ...session,
  expiresAt: session.expiresAt.toISOString(),
});

export const authRoutes = new Elysia({
  prefix: "/auth",
})
  .post(
    "/login",
    async ({ body, cookie: { session: sessionCookie }, status }) => {
      const session = await AuthService.login(body.handle, body.password);

      if (!session) {
        return status("Unauthorized", { error: "Invalid credentials" });
      }

      sessionCookie.set({
        value: session.id,
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        expires: session.expiresAt,
      });

      return { session: serializeSession(session) };
    },
    loginDocs,
  )
  .post(
    "/logout",
    async ({ cookie: { session: sessionCookie } }) => {
      await AuthService.logout(sessionCookie.value);
      sessionCookie.remove();

      return {};
    },
    logoutDocs,
  )
  .get(
    "/session",
    async ({ cookie: { session: sessionCookie } }) => {
      const session = await AuthService.getSession(sessionCookie.value);

      return { session: session ? serializeSession(session) : null };
    },
    getSessionDocs,
  );
