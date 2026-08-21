import { describe, it, expect, vi } from "vitest";
import { StatusMap } from "elysia/utils";

import { usersRoutes } from "./users.routes";
import { fixture_testUser } from "@Schema";

const mock_getUserById = vi.hoisted(() => vi.fn());

vi.mock("@Services", () => ({
  UsersService: {
    getUserById: mock_getUserById,
  },
}));

describe("/users", () => {
  describe("GET /users/:id", () => {
    it("returns the user with the given id", async () => {
      mock_getUserById.mockReturnValueOnce(fixture_testUser);

      const response = await usersRoutes.handle(
        new Request(`http://localhost/users/${fixture_testUser.id}`),
      );

      expect(response.status).toBe(StatusMap["OK"]);
      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: fixture_testUser.id,
        handle: fixture_testUser.handle,
      });
    });

    it("returns Not Found for a nonexistant user", async () => {
      mock_getUserById.mockReturnValueOnce(undefined);

      const response = await usersRoutes.handle(
        new Request(`http://localhost/users/nonexistent`),
      );

      expect(response.status).toBe(StatusMap["Not Found"]);
    });
  });
});
