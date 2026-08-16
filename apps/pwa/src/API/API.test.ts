import { describe, it, expect, vi, afterEach } from "vitest";

import API from "./API";

vi.stubGlobal("fetch", vi.fn());
vi.stubEnv("VITE_API_URL", "https://shinra.com");

const mock_fetch = vi.fn().mockResolvedValue({
  json: vi.fn(),
});

vi.stubGlobal("fetch", mock_fetch);

afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});

describe("API", () => {
  describe("static get", () => {
    it("prepends the base URL to the request", async () => {
      await API.get("/materia");
      expect(mock_fetch).toHaveBeenCalledWith("https://shinra.com/v0/materia");

      await API.get("materia");
      expect(mock_fetch).toHaveBeenCalledWith("https://shinra.com/v0/materia");
    });
  });
});
