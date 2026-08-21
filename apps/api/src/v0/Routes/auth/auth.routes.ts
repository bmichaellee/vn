import Elysia from "elysia";

import { AuthService } from "@Services";

import { getSessionDocs } from "./auth.routes.docs";

export const authRoutes = new Elysia({
  prefix: "/auth",
}).get(
  "/session",
  async () => {
    const session = await AuthService.getSession();

    return { session: session ?? null };
  },
  getSessionDocs,
);
