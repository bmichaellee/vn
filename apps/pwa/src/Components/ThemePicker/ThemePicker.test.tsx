import { useContext } from "react";

import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import { ThemeContext, ThemeProvider } from "@Services";

import { ThemePicker } from "./ThemePicker";

const ThemeConsumer = () => {
  const context = useContext(ThemeContext);
  return <span data-testid="current-theme">{context?.theme?.value}</span>;
};

const ThemedComponent = () => (
  <ThemeProvider>
    <ThemePicker />
    <ThemeConsumer />
  </ThemeProvider>
);

describe("<ThemePicker />", () => {
  it("lists more than just dark and light themes", () => {
    const { getByRole, getAllByRole } = render(<ThemedComponent />);
    getByRole("option", { name: /dark/i });
    getByRole("option", { name: /light/i });
    expect(getAllByRole("option").length).toBeGreaterThan(2);
  });

  it("uses the ThemeProvider to apply a theme when selected", async () => {
    render(<ThemedComponent />);
    const select = screen.getByRole("combobox", { name: /theme picker/i });
    await userEvent.selectOptions(select, "dark");

    expect(screen.getByTestId("current-theme")).toHaveTextContent("dark");
  });
});
