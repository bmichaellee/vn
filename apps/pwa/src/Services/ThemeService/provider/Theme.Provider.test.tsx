import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";

import { ThemeProvider } from "./Theme.Provider";
import { useTheme } from "./useTheme";

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key) => store[key]),
    setItem: vi.fn((key, value) => (store[key] = value)),
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, "localStorage", { value: localStorageMock });

beforeEach(() => {
  localStorage.clear();
});

const ThemeConsumer = () => {
  const { theme } = useTheme();
  return <span data-testid="current-theme">{theme?.value}</span>;
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
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const renderWithoutProvider = () => {
      render(<ThemeConsumer />);
    };

    expect(renderWithoutProvider).toThrow();

    consoleErrorSpy.mockRestore();
  });
});
