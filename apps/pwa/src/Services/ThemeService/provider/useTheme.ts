import { useContext } from "react";

import { ThemeContext } from "./Theme.Context";

import type { ThemeContextValue } from "./Theme.Context";

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
