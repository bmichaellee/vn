import { describe, it, expect } from "vitest";

import { AuthService } from "./Auth.Service";

describe("class AuthService", () => {
  describe("static login", () => {
    it.todo("creates a session for a correct handle and password - issue #1");
    it.todo("verifies the password against the stored hash - issue #1");
    it.todo("returns null for a wrong handle or password - issue #1");
  });

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
