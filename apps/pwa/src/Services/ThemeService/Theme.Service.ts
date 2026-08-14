import * as themes from "./themes";

import type { Theme } from "./Theme";

export class ThemeService {
  static readonly THEME_STORAGE_KEY = "selectedTheme";
  static readonly DEFAULT_THEME: Theme = themes.LightTheme;

  static availableThemes: Theme[] = [
    ...Object.values( themes ),
  ];

  static getTheme(themeValue: string): Theme | undefined {
    return Object.values(this.availableThemes).find((theme) => theme.value === themeValue) ?? this.DEFAULT_THEME;
  }

  static setTheme(themeValue : string): void {
    const theme = this.getTheme(themeValue);
    if (theme) {
      localStorage.setItem( this.THEME_STORAGE_KEY, theme.value);
    }
  }
  
}
