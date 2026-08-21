import { describe, it, expect, vi } from "vitest";
import { StatusMap } from "elysia/utils";

import { authRoutes } from "./auth.routes";

const mock_getSession = vi.hoisted(() => vi.fn());

vi.mock("@Services", () => ({
  AuthService: {
    getSession: mock_getSession,
  },
}));

const requestSession = () =>
  authRoutes.handle(new Request("http://localhost/auth/session"));

describe("/auth", () => {
  describe("GET /auth/session", () => {
    it.todo(
      "reports authenticated when the request has a valid session - issue #1",
    );

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
