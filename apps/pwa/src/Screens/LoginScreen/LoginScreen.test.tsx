import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AuthService, fixture_session } from "@Services";

import { BrowserRouter } from "react-router";

import { ToastProvider } from "@Components/Toast";

import { LoginScreen } from "./LoginScreen";

const renderLoginScreen = () =>
  render(
    <BrowserRouter>
      <ToastProvider>
        <LoginScreen />
      </ToastProvider>
    </BrowserRouter>,
  );

describe("<LoginScreen />", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("disables the login button if the handle or password is empty", async () => {
    const user = userEvent.setup();
    renderLoginScreen();

    const button = screen.getByRole("button", { name: "Log In" });
    const handle = screen.getByPlaceholderText("Handle");
    const password = screen.getByPlaceholderText("Password");

    expect(button).toBeDisabled();

    await user.type(handle, "cloud");
    expect(button).toBeDisabled();

    await user.type(password, "omnislash");
    expect(button).toBeEnabled();

    await user.clear(handle);
    expect(button).toBeDisabled();
  });

  it("triggers a toast with an error message when login fails", async () => {
    const mock_login = vi
      .spyOn(AuthService, "login")
      .mockRejectedValue(new Error(AuthService.INVALID_CREDENTIALS));

    const user = userEvent.setup();
    renderLoginScreen();

    await user.type(screen.getByPlaceholderText("Handle"), "cloud");
    await user.type(screen.getByPlaceholderText("Password"), "omnislash");
    await user.click(screen.getByRole("button", { name: "Log In" }));

    expect(mock_login).toHaveBeenCalledWith("cloud", "omnislash");
    expect(await screen.findByRole("alert")).toHaveTextContent(
      AuthService.INVALID_CREDENTIALS,
    );
  });

  it("triggers a toast and redirects to '/' when login succeeds", async () => {
    const mock_login = vi
      .spyOn(AuthService, "login")
      .mockResolvedValue(fixture_session);

    window.history.pushState({}, "", "/login");

    const user = userEvent.setup();
    renderLoginScreen();

    await user.type(screen.getByPlaceholderText("Handle"), "cloud");
    await user.type(screen.getByPlaceholderText("Password"), "omnislash");
    await user.click(screen.getByRole("button", { name: "Log In" }));

    expect(mock_login).toHaveBeenCalledWith("cloud", "omnislash");
    expect(await screen.findByRole("alert")).toHaveTextContent(
      AuthService.LOGIN_SUCCESSFUL,
    );
    expect(window.location.pathname).toBe("/");
  });
});
