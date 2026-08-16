import "./Dark.styles.css";

import { Bot } from "lucide-react";

import type { Theme } from "../";

const ICON_SIZE = 48;

export const DarkTheme: Theme = {
  name: "Dark",
  value: "dark",
  statusIcons: {
    info: <Bot size={ICON_SIZE} />,
    success: <Bot size={ICON_SIZE} />,
    warning: <Bot size={ICON_SIZE} />,
    error: <Bot size={ICON_SIZE} />,
  },
};
