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

const ICON_SIZE = 48;

const DEFAULT_ICONS = {
  info: <Info size={ICON_SIZE} />,
  success: <Check size={ICON_SIZE} />,
  warning: <Warning size={ICON_SIZE} />,
  error: <Error size={ICON_SIZE} />,
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

  const iconToRender = () =>
    icon ?? theme?.statusIcons?.[variant] ?? DEFAULT_ICONS[variant];

  const offscreenClass =
    horizontal === "center"
      ? offscreenClasses[vertical]
      : offscreenClasses[horizontal];

  const classNames = [
    baseClasses.toast,
    `toast--${variant}`,
    vertical === "top" ? "mt-4" : vertical === "bottom" ? "mb-4" : "",
    ...(visible ? [] : [offscreenClass]),
  ].join(" ");

  return (
    <div className={classNames} role="alert">
      <div
        className={`flex items-center gap-2 ${horizontal === "right" ? "flex-row-reverse" : ""}`}
      >
        {iconToRender()}
        {children}
      </div>
      {variant === "error" && (
        <button aria-label="Dismiss" onClick={onDismiss}>
          <X />
        </button>
      )}
    </div>
  );
};

const baseClasses = {
  toast: [
    "transition-all",
    "duration-300",
    "ease-in-out",
    "text-foreground",
    "rounded",
    "flex",
    "items-center",
    "gap-2",
    "px-4",
    "py-2",
    "shadow-lg",
  ].join(" "),
};

const offscreenClasses = {
  top: "-translate-y-full",
  middle: "opacity-0",
  bottom: "translate-y-full",
  left: "-translate-x-full",
  right: "translate-x-full",
};
