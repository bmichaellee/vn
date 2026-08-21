import { describe, it, expect, vi, afterEach } from "vitest";

import { AuthService } from "./Auth.Service";
import { fixture_session } from "./Auth.fixtures";

const { mock_get, mock_post } = vi.hoisted(() => ({
  mock_get: vi.fn(),
  mock_post: vi.fn(),
}));

vi.mock("@API", () => ({
  API: {
    get: mock_get,
    post: mock_post,
  },
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("class AuthService", () => {
  describe("static login", () => {
    it("logs in by calling POST /v0/auth/login", async () => {
      mock_post.mockResolvedValueOnce({ session: fixture_session });
      const response = await AuthService.login("testuser", "testpassword");
      expect(mock_post).toHaveBeenCalledWith("auth/login", {
        handle: "testuser",
        password: "testpassword",
      });
      expect(response).toEqual({
        message: AuthService.LOGIN_SUCCESSFUL,
        session: fixture_session,
      });
    });

    it("throws a service-unavailable error when the API is unreachable", async () => {
      mock_post.mockRejectedValueOnce(new TypeError("Failed to fetch"));

      let error: Error | undefined;

      try {
        await AuthService.login("testuser", "testpassword");
      } catch (err) {
        error = err as Error;
      }

      expect(error).toBeInstanceOf(Error);
      expect(error?.message).toBe(AuthService.SERVICE_UNAVAILABLE);
    });

    it("rethrows non-network errors from the API untouched", async () => {
      const fixture_error = new Error("teapot");
      mock_post.mockRejectedValueOnce(fixture_error);

      let error: Error | undefined;

      try {
        await AuthService.login("testuser", "testpassword");
      } catch (err) {
        error = err as Error;
      }

      expect(error).toBe(fixture_error);
    });

    it("returns a nonspecific error when login fails", async () => {
      mock_post.mockResolvedValueOnce({ session: null });

      let error: Error | undefined;

      try {
        await AuthService.login("testuser", "testpassword");
      } catch (err) {
        error = err as Error;
      }

      expect(error).toBeInstanceOf(Error);
      expect(error?.message).toBe(AuthService.INVALID_CREDENTIALS);
    });
  });

  describe("static logout", () => {
    it("logs out by calling POST /v0/auth/logout", async () => {
      mock_post.mockResolvedValueOnce(null);

      await AuthService.logout();

      expect(mock_post).toHaveBeenCalledWith("auth/logout");
    });
  });

  describe("static getSession", () => {
    it("determines auth state by calling GET /v0/auth/session", async () => {
      mock_get.mockResolvedValueOnce({ session: fixture_session });

      const session = await AuthService.getSession();

      expect(mock_get).toHaveBeenCalledWith("auth/session");
      expect(session).toEqual(fixture_session);
    });

    it("returns null when unauthenticated", async () => {
      mock_get.mockResolvedValueOnce({ session: null });

      const session = await AuthService.getSession();

      expect(session).toBeNull();
    });
  });
});
