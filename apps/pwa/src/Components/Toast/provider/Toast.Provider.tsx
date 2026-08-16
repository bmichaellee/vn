import { useRef, useState } from "react";

import { TOAST_TRANSITION_MS, Toast } from "../Toast";
import { ToastContext } from "./Toast.Context";

import type { ReactNode } from "react";
import type { ToastProps } from "../Toast";

interface ToastProviderProps {
  children: ReactNode;
}

const AUTO_DISMISS_MS = 5000;

const verticalClasses = {
  top: "top-0",
  middle: "top-1/2 -translate-y-1/2",
  bottom: "bottom-0",
};

const horizontalClasses = {
  left: "left-0",
  center: "left-1/2 -translate-x-1/2",
  right: "right-0",
};

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<
    (ToastProps & { id: number; active: boolean })[]
  >([]);
  const nextIdRef = useRef(0);

  const dismissToast = (id: number) => {
    setToasts((current) =>
      current.map((toast) =>
        toast.id === id ? { ...toast, active: false } : toast,
      ),
    );
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, TOAST_TRANSITION_MS);
  };

  const contextValue = {
    triggerToast: (props: ToastProps) => {
      const id = nextIdRef.current++;
      setToasts((current) => [...current, { ...props, id, active: true }]);

      if (props.variant !== "error") {
        setTimeout(() => dismissToast(id), AUTO_DISMISS_MS);
      }
    },
  };

  const toastStacks = toasts.reduce<
    Record<string, (ToastProps & { id: number; active: boolean })[]>
  >((stacks, toast) => {
    const key = `${toast.vertical ?? "bottom"} ${toast.horizontal ?? "center"}`;
    return { ...stacks, [key]: [...(stacks[key] ?? []), toast] };
  }, {});

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {Object.entries(toastStacks).map(([position, stack]) => {
        const [vertical, horizontal] = position.split(" ") as [
          keyof typeof verticalClasses,
          keyof typeof horizontalClasses,
        ];

        return (
          <div
            key={position}
            className={`fixed flex flex-col ${verticalClasses[vertical]} ${horizontalClasses[horizontal]}`}
          >
            {stack.map(({ id, ...props }) => (
              <Toast key={id} onDismiss={() => dismissToast(id)} {...props} />
            ))}
          </div>
        );
      })}
    </ToastContext.Provider>
  );
};
