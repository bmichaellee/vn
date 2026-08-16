import { createContext } from "react";

export interface ToastContextValue {
  triggerToast: (props: any) => void;
}

export const ToastContext = createContext<ToastContextValue | undefined>(
  undefined,
);
