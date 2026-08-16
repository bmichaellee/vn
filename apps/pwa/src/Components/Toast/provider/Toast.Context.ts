import { createContext } from "react";

import type { ToastProps } from "@Components/Toast";

export interface ToastContextValue {
  triggerToast: (props: ToastProps) => void;
}

export const ToastContext = createContext<ToastContextValue | undefined>(
  undefined,
);
