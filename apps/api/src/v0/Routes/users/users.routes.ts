import Elysia from "elysia";

import { UsersService } from "@Services";
import { getUserDocs } from "./users.routes.docs";

export const usersRoutes = new Elysia({
  prefix: "/users",
}).get(
  "/:id",
  async ({ params: { id }, status }) => {
    const user = await UsersService.getUserById(id);
    if (!user) {
      return status("Not Found", { error: "User not found" });
    }

    return user;
  },
  getUserDocs,
);
