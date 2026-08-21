import { describe, it, expect, vi, afterEach } from "vitest";

import API from "./API";

const BASE_URL = "https://shinra.com";
const REQUEST_URL = `${BASE_URL}/v0/materia`;

vi.stubEnv("VITE_API_URL", BASE_URL);

const mock_fetch = vi.fn().mockResolvedValue({
  json: vi.fn(),
});

vi.stubGlobal("fetch", mock_fetch);

afterEach(() => {
  vi.clearAllMocks();
});

describe("API", () => {
  describe("static get", () => {
    it("prepends the base URL to the request", async () => {
      await API.get("/materia");
      expect(mock_fetch).toHaveBeenCalledWith(REQUEST_URL);

      await API.get("materia");
      expect(mock_fetch).toHaveBeenCalledWith(REQUEST_URL);
    });
  });

  describe("static post", () => {
    it("sends the body as JSON to the prepended URL", async () => {
      await API.post("/materia", { name: "Ifrit" });
      expect(mock_fetch).toHaveBeenCalledWith(REQUEST_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Ifrit" }),
      });
    });
  });
});
