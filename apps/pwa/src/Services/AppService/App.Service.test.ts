import { describe, it, expect, vi } from "vitest";

import { AppService } from "./App.Service";

const { mock_get } = vi.hoisted(() => ({ mock_get: vi.fn() }));

vi.mock("@API", () => ({
  API: {
    get: mock_get,
  },
}));

const mock_healthResponse = {
  database: "ok",
  version: "1.0.0",
};

describe("class AppService", () => {
  describe("static getHealth", () => {
    it("returns a health status object", async () => {
      mock_get.mockResolvedValueOnce(mock_healthResponse);

      const health = await AppService.getHealth();

      expect(health).toEqual(mock_healthResponse);
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
