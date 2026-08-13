import Elysia from "elysia";
import { healthRoutes } from "./health";
import { usersRoutes } from "./users";

export const routes = new Elysia().use(healthRoutes).use(usersRoutes);
