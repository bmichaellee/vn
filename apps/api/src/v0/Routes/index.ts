import Elysia from "elysia";
import { authRoutes } from "./auth";
import { healthRoutes } from "./health";
import { usersRoutes } from "./users";

export const routes = new Elysia()
  .use(authRoutes)
  .use(healthRoutes)
  .use(usersRoutes);
