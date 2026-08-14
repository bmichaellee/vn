import type { Theme } from "../";

import { DefaultTheme } from "./Default.theme";

export const DarkTheme : Theme = {
  name: "Dark",
  value: "dark",
  ...DefaultTheme,

  "background-color": "bg-gray-900",
};
