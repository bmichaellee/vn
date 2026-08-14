import { createContext } from "react";

import type { Theme } from "../themes";

export interface ThemeContextValue {
  theme: Theme | undefined;
  setTheme: (themeValue: string) => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined,
);
