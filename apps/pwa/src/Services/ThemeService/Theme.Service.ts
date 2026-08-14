import * as themes from "./themes";

import type { Theme } from "./themes";

export class ThemeService {
  static readonly THEME_STORAGE_KEY = "selectedTheme";
  static readonly DEFAULT_THEME: Theme = themes.LightTheme;

  static availableThemes: Theme[] = [...Object.values(themes)];

  static getTheme(themeValue: string): Theme {
    return (
      this.availableThemes.find((theme) => theme.value === themeValue) ??
      this.DEFAULT_THEME
    );
  }

  static setTheme(themeValue: string): void {
    const theme = this.getTheme(themeValue);
    localStorage.setItem(this.THEME_STORAGE_KEY, theme.value);
  }
}
