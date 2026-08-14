import { createContext, useContext, useState } from "react";

import { ThemeService } from "../Theme.Service";

import type { ReactNode } from "react";
import type { Theme } from "../Theme";

interface ThemeContextValue {
  theme: Theme | undefined;
  setTheme: (themeValue: string) => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined,
);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme | undefined>(() =>
    ThemeService.getTheme(
      localStorage.getItem(ThemeService.THEME_STORAGE_KEY) ?? "",
    ),
  );

  const setTheme = (themeValue: string) => {
    ThemeService.setTheme(themeValue);
    setThemeState(ThemeService.getTheme(themeValue));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
