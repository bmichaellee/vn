import { describe, it, expect, vi, afterEach } from "vitest";

import { Database } from "@Database";

const { mock_execute } = vi.hoisted(() => ({ mock_execute: vi.fn() }));

vi.mock("drizzle-orm/postgres-js", () => ({
  drizzle: vi.fn().mockReturnValue({
    execute: mock_execute,
  }),
}));

vi.mock("drizzle-orm/pglite", () => ({
  drizzle: vi.fn().mockReturnValue({
    execute: mock_execute,
  }),
}));

vi.mock("postgres", () => ({
  default: vi.fn().mockReturnValue({
    execute: mock_execute,
  }),
}));

afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});

describe("class Database", () => {
  describe("static getConnectionStatus", () => {
    it("returns true when the database connection is successful", async () => {
      mock_execute.mockResolvedValueOnce({});

      const status = await Database.getConnectionStatus();
      expect(status).toBe(true);
    });

    it("returns false when the database connection fails", async () => {
      mock_execute.mockRejectedValueOnce(new Error("connection failed"));

      const status = await Database.getConnectionStatus();
      expect(status).toBe(false);
    });

    it("falls back to the embedded database when DATABASE_URL is not set", async () => {
      vi.stubEnv("DATABASE_URL", "");
      vi.resetModules();
      mock_execute.mockResolvedValueOnce({});

      const { Database: DatabaseEmbedded } = await import("@Database");
      const { drizzle: mock_drizzlePglite } =
        await import("drizzle-orm/pglite");

      const status = await DatabaseEmbedded.getConnectionStatus();
      expect(status).toBe(true);
      expect(mock_drizzlePglite).toHaveBeenCalledWith(
        expect.stringContaining(".data"),
        expect.anything(),
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
