import type { Theme } from "../";

import { DefaultTheme } from "./Default.theme";

export const AlternateTheme: Theme = {
  name: "Alternate",
  value: "alternate",
  ...DefaultTheme,
  
  "background-color": "bg-gray-100",
};
