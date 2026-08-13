import { describe, it, expect, vi, afterEach } from "vitest";

import { UsersService } from "./Users.Service";

const { returning, insert, select } = vi.hoisted(() => {
  const returning = vi.fn();
  const values = vi.fn(() => ({ returning }));
  const insert = vi.fn(() => ({ values }));

  const where = vi.fn(() => returning());
  const from = vi.fn(() => ({ where }));
  const select = vi.fn(() => ({ from }));

  return { returning, values, insert, select };
});

vi.mock("@Database", () => ({
  Database: {
    instance: { insert, select },
  },
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("class UsersService", () => {
  describe("static createUser", () => {
    it("creates a new user in the database with a random nanoid", async () => {
      const createdUser = { id: "V1StGXR8_Z", handle: "ifrit" };
      returning.mockResolvedValueOnce([createdUser]);

      const user = await UsersService.createUser({ handle: "ifrit" });

      expect(insert).toHaveBeenCalled();
      expect(user).toEqual(createdUser);
    });
  });

  describe("static getUserById", () => {
    it("retrieves a user from the database by ID", async () => {
      const retrievedUser = { id: "V1StGXR8_Z", handle: "ifrit" };
      returning.mockResolvedValueOnce([retrievedUser]);

      const user = await UsersService.getUserById("V1StGXR8_Z");

      expect(insert).toHaveBeenCalledTimes(0);
      expect(user).toEqual(retrievedUser);
    });

    it("returns undefined if the user does not exist", async () => {
      returning.mockResolvedValueOnce([]);

      const user = await UsersService.getUserById("nonexistent");

      expect(user).toBeUndefined();
    });
  });
});
