import { describe, it, expect, vi, afterEach } from "vitest";
import { StatusMap } from "elysia/utils";

import { fixture_testSession, fixture_testUser } from "@Schema";

import { authRoutes } from "./auth.routes";

const { mock_login, mock_getSession } = vi.hoisted(() => ({
  mock_login: vi.fn(),
  mock_getSession: vi.fn(),
}));

vi.mock("@Services", () => ({
  AuthService: {
    login: mock_login,
    getSession: mock_getSession,
  },
}));

const fixture_session = {
  id: fixture_testSession.id,
  expiresAt: fixture_testSession.expiresAt,
  user: { id: fixture_testUser.id, handle: fixture_testUser.handle },
};

const requestLogin = (handle: string, password: string) =>
  authRoutes.handle(
    new Request("http://localhost/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ handle, password }),
    }),
  );

const requestSession = (sessionId?: string) =>
  authRoutes.handle(
    new Request("http://localhost/auth/session", {
      headers: sessionId ? { Cookie: `session=${sessionId}` } : {},
    }),
  );

afterEach(() => {
  vi.clearAllMocks();
});

describe("/auth", () => {
  describe("POST /auth/login", () => {
    it("creates a session and sets an httpOnly cookie for correct credentials", async () => {
      mock_login.mockResolvedValueOnce(fixture_session);

      const response = await requestLogin("ifrit", "omnislash");

      expect(mock_login).toHaveBeenCalledWith("ifrit", "omnislash");
      expect(response.status).toBe(StatusMap["OK"]);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        session: {
          ...fixture_session,
          expiresAt: fixture_session.expiresAt.toISOString(),
        },
      });

      const setCookie = response.headers.get("set-cookie");
      expect(setCookie).toContain(`session=${fixture_session.id}`);
      expect(setCookie).toContain("HttpOnly");
    });

    it("returns 401 for wrong credentials", async () => {
      mock_login.mockResolvedValueOnce(null);

      const response = await requestLogin("ifrit", "wrong-password");

      expect(response.status).toBe(StatusMap["Unauthorized"]);
      expect(response.headers.get("set-cookie")).toBeNull();
    });

    it("does not distinguish wrong handle from wrong password", async () => {
      mock_login.mockResolvedValueOnce(null);
      const wrongHandle = await requestLogin("no-such-user", "omnislash");

      mock_login.mockResolvedValueOnce(null);
      const wrongPassword = await requestLogin("ifrit", "wrong-password");

      expect(wrongPassword.status).toBe(wrongHandle.status);
      expect(await wrongPassword.json()).toEqual(await wrongHandle.json());
    });
  });

  describe("GET /auth/session", () => {
    it("reports authenticated when the request has a valid session", async () => {
      mock_getSession.mockResolvedValueOnce(fixture_session);

      const response = await requestSession(fixture_session.id);

      expect(mock_getSession).toHaveBeenCalledWith(fixture_session.id);
      expect(response.status).toBe(StatusMap["OK"]);
      expect(await response.json()).toEqual({
        session: {
          ...fixture_session,
          expiresAt: fixture_session.expiresAt.toISOString(),
        },
      });
    });

    it("returns a null session with 200 when unauthenticated", async () => {
      mock_getSession.mockResolvedValueOnce(null);

      const response = await requestSession();

      expect(mock_getSession).toHaveBeenCalled();
      expect(response.status).toBe(StatusMap["OK"]);
      const responseBody = await response.json();
      expect(responseBody).toEqual({ session: null });
    });
  });
});
