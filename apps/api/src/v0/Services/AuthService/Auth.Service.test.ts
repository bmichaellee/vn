import { describe, it, expect, vi, afterEach } from "vitest";

import {
  fixture_testSession,
  fixture_testUser,
  fixture_testUserPassword,
} from "@Schema";

import { AuthService } from "./Auth.Service";

const {
  mock_where,
  mock_select,
  mock_insert,
  mock_returning,
  mock_delete,
  mock_deleteWhere,
} = vi.hoisted(() => {
  const mock_where = vi.fn();
  const mock_innerJoin = vi.fn(() => ({ where: mock_where }));
  const mock_from = vi.fn(() => ({
    where: mock_where,
    innerJoin: mock_innerJoin,
  }));
  const mock_select = vi.fn(() => ({ from: mock_from }));

  const mock_returning = vi.fn();
  const mock_values = vi.fn(() => ({ returning: mock_returning }));
  const mock_insert = vi.fn(() => ({ values: mock_values }));

  const mock_deleteWhere = vi.fn();
  const mock_delete = vi.fn(() => ({ where: mock_deleteWhere }));

  return {
    mock_where,
    mock_select,
    mock_insert,
    mock_returning,
    mock_delete,
    mock_deleteWhere,
  };
});

vi.mock("@Database", () => ({
  Database: {
    instance: {
      select: mock_select,
      insert: mock_insert,
      delete: mock_delete,
    },
  },
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("class AuthService", () => {
  describe("static login", () => {
    it("creates a session for a correct handle and password", async () => {
      mock_where.mockResolvedValueOnce([fixture_testUser]);
      mock_returning.mockResolvedValueOnce([fixture_testSession]);

      const session = await AuthService.login(
        fixture_testUser.handle,
        fixture_testUserPassword,
      );

      expect(mock_insert).toHaveBeenCalled();
      expect(session).toEqual({
        id: fixture_testSession.id,
        expiresAt: fixture_testSession.expiresAt,
        user: { id: fixture_testUser.id, handle: fixture_testUser.handle },
      });
    });

    it("verifies the password against the stored hash", async () => {
      mock_where.mockResolvedValueOnce([fixture_testUser]);

      const session = await AuthService.login(
        fixture_testUser.handle,
        "wrong-password",
      );

      expect(session).toBeNull();
      expect(mock_insert).not.toHaveBeenCalled();
    });

    it("returns null for a wrong handle or password", async () => {
      mock_where.mockResolvedValueOnce([]);

      const session = await AuthService.login(
        "nonexistent",
        fixture_testUserPassword,
      );

      expect(session).toBeNull();
      expect(mock_insert).not.toHaveBeenCalled();
    });
  });

  describe("static logout", () => {
    it("deletes the session for the given session id", async () => {
      mock_deleteWhere.mockResolvedValueOnce(undefined);

      await AuthService.logout(fixture_testSession.id);

      expect(mock_delete).toHaveBeenCalled();
    });

    it("does nothing without a session id", async () => {
      await AuthService.logout();

      expect(mock_delete).not.toHaveBeenCalled();
    });
  });

  describe("static getSession", () => {
    it("returns the session for a request with a valid session", async () => {
      mock_where.mockResolvedValueOnce([
        { sessions: fixture_testSession, users: fixture_testUser },
      ]);

      const session = await AuthService.getSession(fixture_testSession.id);

      expect(session).toEqual({
        id: fixture_testSession.id,
        expiresAt: fixture_testSession.expiresAt,
        user: { id: fixture_testUser.id, handle: fixture_testUser.handle },
      });
    });

    it("returns null for an expired session", async () => {
      mock_where.mockResolvedValueOnce([
        {
          sessions: { ...fixture_testSession, expiresAt: new Date(0) },
          users: fixture_testUser,
        },
      ]);

      const session = await AuthService.getSession(fixture_testSession.id);

      expect(session).toBeNull();
    });

    it("returns null for a request with no session", async () => {
      const session = await AuthService.getSession();

      expect(session).toBeNull();
    });
  });
});
