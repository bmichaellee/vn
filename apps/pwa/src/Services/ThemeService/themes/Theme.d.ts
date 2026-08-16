import type { ReactNode } from "react";

export interface Theme {
  name: string;
  value: string;
  statusIcons?: {
    info?: ReactNode;
    success?: ReactNode;
    warning?: ReactNode;
    error?: ReactNode;
  };
}
