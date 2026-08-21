import { describe, it, expect, vi } from "vitest";

import { AuthService } from "./Auth.Service";

const { mock_get } = vi.hoisted(() => ({ mock_get: vi.fn() }));

vi.mock("@API", () => ({
  API: {
    get: mock_get,
  },
}));

// We don't know what the session looks like yet, so just use an empty object for now
const mock_session = {};

describe("class AuthService", () => {
  describe("static getSession", () => {
    it("determines auth state by calling GET /v0/auth/session", async () => {
      mock_get.mockResolvedValueOnce({ session: mock_session });

      const session = await AuthService.getSession();

      expect(mock_get).toHaveBeenCalledWith("auth/session");
      expect(session).toEqual(mock_session);
    });

    it("returns null when unauthenticated", async () => {
      mock_get.mockResolvedValueOnce({ session: null });

      const session = await AuthService.getSession();

      expect(session).toBeNull();
    });
  });
});
