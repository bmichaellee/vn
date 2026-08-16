import { useState } from "react";

import { Toast } from "../Toast";
import { ToastContext } from "./Toast.Context";

import type { ReactNode } from "react";
import type { ToastProps } from "../Toast";

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const contextValue = {
    triggerToast: (props: ToastProps) => {
      setToasts((current) => [...current, props]);
    },
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {toasts.map((props, index) => (
        <Toast key={index} {...props} />
      ))}
    </ToastContext.Provider>
  );
};
