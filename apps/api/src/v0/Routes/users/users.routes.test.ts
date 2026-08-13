import { describe, it, expect, vi } from "vitest";
import { StatusMap } from "elysia/utils";

import { usersRoutes } from "./users.routes";

const getUserById = vi.hoisted(() => vi.fn());

vi.mock("@Services", () => ({
  UsersService: {
    getUserById,
  },
}));

const testUser = {
  id: "V1StGXR8_Z",
  handle: "ifrit",
};

describe("/users", () => {
  describe("GET /users/:id", () => {
    it("returns the user with the given id", async () => {
      getUserById.mockReturnValueOnce(testUser);

      const response = await usersRoutes.handle(
        new Request(`http://localhost/users/${testUser.id}`),
      );

      expect(response.status).toBe(StatusMap["OK"]);
      const responseBody = await response.json();
      expect(responseBody).toEqual(testUser);
    });

    it("returns Not Found for a nonexistant user", async () => {
      getUserById.mockReturnValueOnce(undefined);

      const response = await usersRoutes.handle(
        new Request(`http://localhost/users/nonexistent`),
      );

      expect(response.status).toBe(StatusMap["Not Found"]);
    });
  });
});
