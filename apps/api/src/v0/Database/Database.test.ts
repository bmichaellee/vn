import { describe, it, expect, vi, afterEach } from "vitest";

import { Database } from "@Database";

const { execute } = vi.hoisted(() => ({ execute: vi.fn() }));

vi.mock("drizzle-orm/postgres-js", () => ({
  drizzle: vi.fn().mockReturnValue({
    execute,
  }),
}));

vi.mock("postgres", () => ({
  default: vi.fn().mockReturnValue({
    execute,
  }),
}));

afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});

describe("class Database", () => {
  describe("static getConnectionStatus", () => {
    it("returns true when the database connection is successful", async () => {
      execute.mockResolvedValueOnce({});

      const status = await Database.getConnectionStatus();
      expect(status).toBe(true);
    });

    it("returns false when the database connection fails", async () => {
      execute.mockRejectedValueOnce(new Error("connection failed"));

      const status = await Database.getConnectionStatus();
      expect(status).toBe(false);
    });

    it("throws when DATABASE_URL is not set", async () => {
      vi.stubEnv("DATABASE_URL", "");
      vi.resetModules();

      const { Database: DatabaseWithoutUrl } = await import("@Database");

      await expect(DatabaseWithoutUrl.getConnectionStatus()).rejects.toThrow(
        "DATABASE_URL not set",
      );
    });
  });

  describe("static instance", () => {
    it("returns the database connection instance", () => {
      const connection = Database.instance;
      expect(connection).toBeDefined();
    });
  });
});
