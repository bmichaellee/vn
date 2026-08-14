import { useEffect, useState } from "react";

import { ThemeService } from "../Theme.Service";
import { ThemeContext } from "./Theme.Context";

import type { ReactNode } from "react";
import type { Theme } from "../themes";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() =>
    ThemeService.getTheme(
      localStorage.getItem(ThemeService.THEME_STORAGE_KEY) ?? "",
    ),
  );

  const setTheme = (themeValue: string) => {
    ThemeService.setTheme(themeValue);
    setThemeState(ThemeService.getTheme(themeValue));
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme?.value);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
