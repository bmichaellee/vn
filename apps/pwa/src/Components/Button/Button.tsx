import { useIntentColor } from "@Hooks";

import "./Button.styles.css";

interface ButtonProps {
  title?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  secondary?: boolean;
  destructive?: boolean;
  type?: "button" | "submit";
}

export const Button = ({
  title,
  children,
  disabled,
  icon,
  onClick,
  className,
  secondary,
  destructive,
  type = "button",
}: ButtonProps) => {
  const themeColor = useIntentColor({ secondary, destructive });

  const classNames = [
    classes.button,
    `bg-(${themeColor})`,
    ...(secondary ? ["button--secondary"] : []),
    ...(className?.split(" ").filter(Boolean) ?? []),
  ].join(" ");

  const buttonText = title ?? children ?? (icon ? null : "Button");

  return (
    <button
      type={type}
      className={classNames}
      disabled={disabled || (!onClick && type !== "submit")}
      onClick={onClick}
    >
      {icon}
      {buttonText}
    </button>
  );
};

const classes = {
  button: [
    "px-4",
    "py-2",
    "rounded-md",
    "text-foreground",
    "font-medium",
    "text-xl",
  ].join(" "),
};
