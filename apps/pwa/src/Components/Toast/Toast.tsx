import { useContext } from "react";

import { usePresence } from "@Hooks";

import "./Toast.styles.css";
import { ThemeContext } from "@Services";
import {
  Check,
  Info,
  TriangleAlert as Warning,
  OctagonAlert as Error,
  X,
} from "lucide-react";

export const TOAST_TRANSITION_MS = 300;

export interface ToastProps {
  variant?: "info" | "success" | "warning" | "error";
  vertical?: "top" | "middle" | "bottom";
  horizontal?: "left" | "center" | "right";
  active?: boolean;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  onDismiss?: () => void;
}

const DEFAULT_ICONS = {
  info: <Info />,
  success: <Check />,
  warning: <Warning />,
  error: <Error />,
};

export const Toast = ({
  variant = "info",
  active = true,
  vertical = "bottom",
  horizontal = "center",
  icon,
  children,
  onDismiss,
}: ToastProps) => {
  const { mounted, visible } = usePresence(active, TOAST_TRANSITION_MS);
  const theme = useContext(ThemeContext)?.theme;

  if (!mounted) return null;

  const iconToRender =
    icon ?? theme?.statusIcons?.[variant] ?? DEFAULT_ICONS[variant];

  const offscreenClass =
    vertical === "middle"
      ? horizontal === "left"
        ? offscreenClasses.middleLeft
        : horizontal === "right"
          ? offscreenClasses.middleRight
          : offscreenClasses.middleCenter
      : offscreenClasses[vertical];

  const classNames = [
    "transition-all",
    "duration-300",
    "ease-in-out",
    `toast--${variant}`,
    "text-foreground",
    "rounded",
    "flex",
    "items-center",
    "gap-2",
    "px-4",
    "py-2",
    "shadow-lg",
    horizontal === "right" ? "flex-row-reverse" : "",
    vertical === "top" ? "mt-4" : vertical === "bottom" ? "mb-4" : "",
    ...(visible ? [] : [offscreenClass]),
  ].join(" ");

  return (
    <div className={classNames} role="alert">
      <span className={`toast-icon--${variant}`}>{iconToRender}</span>
      {children}
      {variant === "error" && (
        <button aria-label="Dismiss" onClick={onDismiss}>
          <X />
        </button>
      )}
    </div>
  );
};

const offscreenClasses = {
  top: "-translate-y-full",
  bottom: "translate-y-full",
  middleLeft: "-translate-x-full",
  middleRight: "translate-x-full",
  middleCenter: "opacity-0",
};
