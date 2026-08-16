import { describe, it, expect, vi, afterEach } from "vitest";

import { UsersService } from "./Users.Service";

const { mock_returning, mock_insert, mock_select } = vi.hoisted(() => {
  const mock_returning = vi.fn();
  const mock_values = vi.fn(() => ({ returning: mock_returning }));
  const mock_insert = vi.fn(() => ({ values: mock_values }));

  const mock_where = vi.fn(() => mock_returning());
  const mock_from = vi.fn(() => ({ where: mock_where }));
  const mock_select = vi.fn(() => ({ from: mock_from }));

  return { mock_returning, mock_values, mock_insert, mock_select };
});

vi.mock("@Database", () => ({
  Database: {
    instance: { insert: mock_insert, select: mock_select },
  },
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("class UsersService", () => {
  describe("static createUser", () => {
    it("creates a new user in the database with a random nanoid", async () => {
      const createdUser = { id: "V1StGXR8_Z", handle: "ifrit" };
      mock_returning.mockResolvedValueOnce([createdUser]);

      const user = await UsersService.createUser({ handle: "ifrit" });

      expect(mock_insert).toHaveBeenCalled();
      expect(user).toEqual(createdUser);
    });
  });

  describe("static getUserById", () => {
    it("retrieves a user from the database by ID", async () => {
      const retrievedUser = { id: "V1StGXR8_Z", handle: "ifrit" };
      mock_returning.mockResolvedValueOnce([retrievedUser]);

      const user = await UsersService.getUserById("V1StGXR8_Z");

      expect(mock_insert).toHaveBeenCalledTimes(0);
      expect(user).toEqual(retrievedUser);
    });

    it("returns undefined if the user does not exist", async () => {
      mock_returning.mockResolvedValueOnce([]);

      const user = await UsersService.getUserById("nonexistent");

      expect(user).toBeUndefined();
    });
  });
});
