import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";

import { SplashScreen } from "./SplashScreen";

const { TAGLINE, LOGIN_BUTTON_TEXT } = vi.hoisted(() => ({
  TAGLINE: "This is a tagline",
  LOGIN_BUTTON_TEXT: "Sign In",
}));

vi.mock("@Services", () => ({
  AppService: {
    TAGLINE,
    LOGIN_BUTTON_TEXT,
  },
}));

const renderSplashScreen = () =>
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<div>Login Screen</div>} />
      </Routes>
    </MemoryRouter>,
  );

describe("<SplashScreen />", () => {
  it("renders a large SVG icon", () => {
    const { getByLabelText } = renderSplashScreen();
    const icon = getByLabelText("app icon");
    expect(icon).toBeInTheDocument();
  });

  it("renders the tagline text from AppService", () => {
    const { getByText } = renderSplashScreen();
    const tagline = getByText(TAGLINE);
    expect(tagline).toBeInTheDocument();
  });

  it("renders a login button with text from AppService", () => {
    const { getByText } = renderSplashScreen();
    const button = getByText(LOGIN_BUTTON_TEXT);
    expect(button).toBeInTheDocument();
  });

  it("navigates to /login when Sign In is tapped", async () => {
    const user = userEvent.setup();
    const { getByText } = renderSplashScreen();
    await user.click(getByText(LOGIN_BUTTON_TEXT));
    expect(getByText("Login Screen")).toBeInTheDocument();
  });
});
