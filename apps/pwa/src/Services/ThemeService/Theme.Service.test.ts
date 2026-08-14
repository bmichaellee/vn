import { beforeEach, describe, expect, it, vi } from "vitest";

import { ThemeService } from "./Theme.Service";

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

describe("ThemeService", () => {
  describe("static availableThemes", () => {
    it("exposes dark and light themes, and at least one other", () => {
      const themes = ThemeService.availableThemes;
      expect(themes).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: "Dark", value: "dark" }),
          expect.objectContaining({ name: "Light", value: "light" }),
        ]),
      );
      expect(themes.length).toBeGreaterThan(2);
    });
  });

  describe("static setTheme", () => {
    it("persists the selected theme via localStorage so it survives a refresh", async () => {
      expect(
        localStorageMock.getItem(ThemeService.THEME_STORAGE_KEY),
      ).toBeUndefined();

      ThemeService.setTheme("dark");
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        ThemeService.THEME_STORAGE_KEY,
        "dark",
      );
    });
  });
});
