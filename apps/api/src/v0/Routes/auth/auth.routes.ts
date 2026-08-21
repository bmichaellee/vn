import Elysia from "elysia";

import { AuthService } from "@Services";

import { getSessionDocs, loginDocs } from "./auth.routes.docs";

export const authRoutes = new Elysia({
  prefix: "/auth",
})
  .post(
    "/login",
    async ({ status }) =>
      status("Unauthorized", { error: "Invalid credentials" }),
    loginDocs,
  )
  .get(
    "/session",
    async () => {
      const session = await AuthService.getSession();

      return { session: session ?? null };
    },
    getSessionDocs,
  );
