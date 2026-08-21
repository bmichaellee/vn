import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";

import { ThemeService } from "../Theme.Service";
import { ThemeProvider } from "./Theme.Provider";
import { useTheme } from "./useTheme";

const mock_localStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key) => store[key]),
    setItem: vi.fn((key, value) => (store[key] = value)),
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, "localStorage", { value: mock_localStorage });

beforeEach(() => {
  localStorage.clear();
});

const ThemeConsumer = () => {
  const { theme, setTheme } = useTheme();
  return (
    <span data-testid="current-theme" onClick={() => setTheme("dark")}>
      {theme?.value}
    </span>
  );
};

const ThemedComponent = () => (
  <ThemeProvider>
    <ThemeConsumer />
  </ThemeProvider>
);

describe("<ThemeProvider />", () => {
  it("defaults to the light theme when no theme is persisted in localStorage", () => {
    const { getByTestId } = render(<ThemedComponent />);
    expect(getByTestId("current-theme").textContent).toBe("light");
  });

  it("throws an error when the ThemeProvider is used without a ThemeContext", () => {
    const mock_consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const renderWithoutProvider = () => {
      render(<ThemeConsumer />);
    };

    expect(renderWithoutProvider).toThrow();

    mock_consoleError.mockRestore();
  });

  it("uses the ThemeService to set and get themes", () => {
    const mock_getTheme = vi.spyOn(ThemeService, "getTheme");
    const mock_setTheme = vi.spyOn(ThemeService, "setTheme");

    const { getByTestId } = render(<ThemedComponent />);
    expect(mock_getTheme).toHaveBeenCalled();

    fireEvent.click(getByTestId("current-theme"));
    expect(mock_setTheme).toHaveBeenCalledWith("dark");
    expect(getByTestId("current-theme").textContent).toBe("dark");

    mock_getTheme.mockRestore();
    mock_setTheme.mockRestore();
  });
});
