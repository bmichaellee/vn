import { describe, it, expect, vi } from "vitest";

import { AppService } from "./App.Service";

const { get } = vi.hoisted(() => ({ get: vi.fn() }));

vi.mock("@API", () => ({
  API: {
    get,
  },
}));

const mockHealthResponse = {
  database: "ok",
  version: "1.0.0",
};

describe("class AppService", () => {
  describe("static getHealth", () => {
    it("returns a health status object", async () => {
      get.mockResolvedValueOnce(mockHealthResponse);

      const health = await AppService.getHealth();

      expect(health).toEqual(mockHealthResponse);
    });
  });

  describe("static getVersion", () => {
    it("returns an injected version number if it exists", () => {
      (globalThis as { __APP_VERSION__?: unknown }).__APP_VERSION__ = "1.2.3";

      const version = AppService.getVersion();

      expect(version).toBe("1.2.3");
    });

    it("returns a default version number if no injected version exists", () => {
      delete (globalThis as { __APP_VERSION__?: unknown }).__APP_VERSION__;

      const version = AppService.getVersion();

      expect(version).toBe("0.0.0");
    });
  });
});
