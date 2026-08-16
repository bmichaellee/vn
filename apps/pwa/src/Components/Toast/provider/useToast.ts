import { useContext } from "react";

import { ToastContext } from "./Toast.Context";

import type { ToastContextValue } from "./Toast.Context";

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
