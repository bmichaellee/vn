import { describe, it, expect, vi, afterEach } from "vitest";

import { AppService } from "@Services";
import { healthRoutes } from "./health.routes";
import { StatusMap } from "elysia/utils";

const getConnectionStatus = vi.hoisted(() => vi.fn().mockResolvedValue(true));

vi.mock("@Database", () => ({
  Database: {
    getConnectionStatus,
  },
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("/health", () => {
  describe("GET /health", () => {
    it("returns the app version", async () => {
      const response = await healthRoutes.handle(
        new Request("http://localhost/health"),
      );

      const serviceVersion = AppService.getVersion();
      const { version: responseVersion } = await response.json();

      expect(response.status).toBe(StatusMap["OK"]);
      expect(responseVersion).toEqual(serviceVersion);
    });

    it("returns the database connection failure status", async () => {
      getConnectionStatus.mockResolvedValueOnce(false);

      const response = await healthRoutes.handle(
        new Request("http://localhost/health"),
      );

      const { database } = await response.json();

      expect(response.status).toBe(StatusMap["Service Unavailable"]);
      expect(database).toEqual("error");
    });

    it("returns the database connection success status", async () => {
      const response = await healthRoutes.handle(
        new Request("http://localhost/health"),
      );

      const { database } = await response.json();

      expect(response.status).toBe(StatusMap["OK"]);
      expect(database).toEqual("ok");
    });
  });
});
