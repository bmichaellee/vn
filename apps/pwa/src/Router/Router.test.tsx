import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

import { AuthContext, AppService } from "@Services";

import { ToastProvider } from "@Components/Toast";

import { Router } from "./Router";

const AuthenticatedRouter = ({ session }: { session?: any }) => (
  <AuthContext.Provider value={{ session }}>
    <ToastProvider>
      <Router />
    </ToastProvider>
  </AuthContext.Provider>
);

describe("<Router />", () => {
  it("redirects unauthenticated visits to protected routes to /", () => {
    window.history.pushState({}, "", "/protected");

    render(<AuthenticatedRouter />);

    expect(window.location.pathname).toBe("/");
    expect(screen.getByText(AppService.TAGLINE)).toBeInTheDocument();
  });

  it("allows authenticated visits to protected routes", () => {
    window.history.pushState({}, "", "/protected");

    render(<AuthenticatedRouter session={{}} />);
    expect(window.location.pathname).toBe("/protected");
  });

  it("reflects the current page in the address bar", () => {
    window.history.pushState({}, "", "/login");

    render(<AuthenticatedRouter />);

    expect(screen.getByText(AppService.APP_NAME)).toBeInTheDocument();
    expect(window.location.pathname).toBe("/login");
  });

  it("drops the blocked protected URL from history so Back skips it", async () => {
    window.history.pushState({}, "", "/login");
    window.history.pushState({}, "", "/protected");

    render(<AuthenticatedRouter />);

    expect(window.location.pathname).toBe("/");

    window.history.back();

    await waitFor(() => expect(window.location.pathname).toBe("/login"));
  });

  it("renders public routes without redirect when unauthenticated", () => {
    window.history.pushState({}, "", "/login");

    render(<AuthenticatedRouter />);

    expect(window.location.pathname).toBe("/login");
    expect(screen.queryByText(AppService.TAGLINE)).not.toBeInTheDocument();
  });
});
