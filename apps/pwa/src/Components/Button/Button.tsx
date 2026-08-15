import "./Button.styles.css";

interface ButtonProps {
  title?: string;
  children?: React.ReactNode;
  primary?: boolean;
  secondary?: boolean;
  destructive?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const Button = ({
  title,
  children,
  primary,
  secondary,
  destructive,
  disabled,
  icon,
  onClick,
  className,
}: ButtonProps) => {
  const themeColor = primary
    ? "--primary"
    : destructive
      ? "--destructive"
      : secondary
        ? "--secondary"
        : "--primary";

  const classNames = [
    classes.button,
    `bg-(${themeColor})`,
    ...(destructive ? ["button--destructive"] : []),
    ...(secondary ? ["button--secondary"] : []),
    ...(className?.split(" ").filter(Boolean) ?? []),
  ].join(" ");

  const buttonText = title ?? children ?? (icon ? null : "Button");

  return (
    <button
      className={classNames}
      disabled={disabled || !onClick}
      onClick={onClick}
    >
      {icon}
      {buttonText}
    </button>
  );
};

const classes = {
  button: ["px-4", "py-1", "rounded-md", "text-foreground", "font-medium"].join(
    " ",
  ),
};
