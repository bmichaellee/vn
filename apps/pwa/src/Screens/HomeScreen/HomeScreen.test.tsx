import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { BrowserRouter } from "react-router";

import { HomeScreen } from "./HomeScreen";

import { fixture_session } from "@Services";

const { mock_logout, mock_setSession } = vi.hoisted(() => ({
  mock_logout: vi.fn(),
  mock_setSession: vi.fn(),
}));

vi.mock("@Services", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@Services")>();

  return {
    ...actual,
    AuthService: {
      ...actual.AuthService,
      logout: mock_logout,
    },
    useAuth: () => ({
      session: actual.fixture_session,
      setSession: mock_setSession,
    }),
  };
});

const renderHomeScreen = () =>
  render(
    <BrowserRouter>
      <HomeScreen />
    </BrowserRouter>,
  );

describe("<HomeScreen />", () => {
  it("displays a centered 'Welcome, <handle>' placeholder for the logged-in user", () => {
    const { getByText } = renderHomeScreen();
    const element = getByText(`Welcome, ${fixture_session.user.handle}`);
    expect(element).toBeInTheDocument();
  });

  it("logs the user out when the Logout button is clicked", async () => {
    mock_logout.mockResolvedValue(undefined);

    const user = userEvent.setup();
    renderHomeScreen();

    await user.click(screen.getByRole("button", { name: "Log Out" }));

    expect(mock_logout).toHaveBeenCalled();
    expect(mock_setSession).toHaveBeenCalledWith(null);
  });
});
