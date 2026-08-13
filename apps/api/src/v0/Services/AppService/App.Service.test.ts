import { describe, it, expect } from "vitest";

import { version as packageVersion } from "@Root/package.json";
import { AppService } from "./App.Service";

describe("class AppService", () => {
  describe("static getVersion", () => {
    it("returns an app version from the root package.json", () => {
      const serviceVersion = AppService.getVersion();

      expect(serviceVersion).toBe(packageVersion);
    });
  });
});
