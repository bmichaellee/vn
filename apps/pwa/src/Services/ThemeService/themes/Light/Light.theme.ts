import type { Theme } from "../";

import { DefaultTheme } from "./Default.theme";

export const LightTheme: Theme = {
  name: "Light",
  value: "light",
  ...DefaultTheme,

  "background-color": "bg-gray-50",
};
