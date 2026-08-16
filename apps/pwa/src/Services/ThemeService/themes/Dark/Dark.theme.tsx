import "./Dark.styles.css";

import { Bot } from "lucide-react";

import type { Theme } from "../";

export const DarkTheme: Theme = {
  name: "Dark",
  value: "dark",
  statusIcons: {
    info: <Bot />,
    success: <Bot />,
    warning: <Bot />,
    error: <Bot />,
  },
};
