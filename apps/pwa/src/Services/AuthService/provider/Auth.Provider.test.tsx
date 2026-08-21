import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { AuthProvider } from "./Auth.Provider";
import { useAuth } from "./useAuth";

import { fixture_session } from "../Auth.fixtures";

const { mock_getSession } = vi.hoisted(() => ({ mock_getSession: vi.fn() }));

vi.mock("../Auth.Service", () => ({
  AuthService: {
    getSession: mock_getSession,
  },
}));

const AuthConsumer = () => {
  mock_getSession.mockResolvedValueOnce(fixture_session);
  const auth = useAuth();
  return <span data-testid="auth-state">{JSON.stringify(auth?.session)}</span>;
};

describe("<AuthProvider />", () => {
  it("provides auth state from AuthService to consumers", async () => {
    mock_getSession.mockResolvedValueOnce(fixture_session);

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>,
    );

    expect(await screen.findByTestId("auth-state")).toHaveTextContent(
      JSON.stringify(fixture_session),
    );
  });
});
