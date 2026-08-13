import { describe, it, expect, vi, afterEach } from "vitest";

import API from "./API";

vi.stubGlobal("fetch", vi.fn());
vi.stubEnv("VITE_API_URL", "https://shinra.com");

const fetchMock = vi.fn().mockResolvedValue({
  json: vi.fn(),
});

vi.stubGlobal("fetch", fetchMock);

afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});

describe("API", () => {
  describe("static get", () => {
    it("prepends the base URL to the request", async () => {
      await API.get("/materia");
      expect(fetchMock).toHaveBeenCalledWith("https://shinra.com/v0/materia");

      await API.get("materia");
      expect(fetchMock).toHaveBeenCalledWith("https://shinra.com/v0/materia");
    });
  });
});
