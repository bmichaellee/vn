import { describe, it, expect } from "vitest";

import { AuthService } from "./Auth.Service";

describe("class AuthService", () => {
  describe("static getSession", () => {
    it.todo(
      "returns the session for a request with a valid session - issue #1",
    );

    it("returns null for a request with no session", async () => {
      const session = await AuthService.getSession();

      expect(session).toBeNull();
    });
  });
});
