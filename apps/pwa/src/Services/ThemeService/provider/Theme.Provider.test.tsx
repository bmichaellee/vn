import { beforeEach, describe, expect, it, vi } from "vitest";
import { useContext } from "react";
import { render } from "@testing-library/react";

import { ThemeContext, ThemeProvider } from "./Theme.Provider";
  
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key) => store[key]),
    setItem: vi.fn((key, value) => store[key] = value),
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

beforeEach(() => {
  localStorage.clear();
});
  
const ThemeConsumer = () => {
  const context = useContext(ThemeContext);
  return <span data-testid="current-theme">{context?.theme?.value}</span>;
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
});
