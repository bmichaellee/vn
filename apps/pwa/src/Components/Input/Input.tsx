import { OctagonAlert } from "lucide-react";

import "./Input.styles.css";

import type { ChangeEvent } from "react";

export type InputChangeEvent = ChangeEvent<HTMLInputElement>;

export interface InputProps {
  className?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: InputChangeEvent) => void;
  error?: string;
  reserveErrorSpace?: boolean;
  isPassword?: boolean;
  autoFocus?: boolean;
}

interface LabelProps {
  children?: React.ReactNode;
  label: string;
}

const LabelInput = ({ children, label }: LabelProps) => (
  <label className="flex flex-col gap-1">
    <span className="font-medium ps-2">{label}</span>
    {children}
  </label>
);

export const Input = ({
  className = "",
  label,
  placeholder,
  value,
  onChange,
  isPassword = false,
  error,
  reserveErrorSpace,
  autoFocus = false,
}: InputProps) => {
  const classes = [
    baseClasses.input,
    error ? "input--error" : "",
    className,
  ].join(" ");

  const errorClasses = [
    error ? "input-error-message" : "opacity-0",
    baseClasses.errorMessage,
  ].join(" ");

  const baseInput = (
    <>
      <input
        role="textbox"
        type={isPassword ? "password" : "text"}
        aria-label={label ?? ""}
        className={classes}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoFocus={autoFocus}
      />
      {(reserveErrorSpace || error) && (
        <div className={errorClasses}>
          <OctagonAlert size={16} />
          {error}
        </div>
      )}
    </>
  );

  if (label) {
    return <LabelInput label={label}>{baseInput}</LabelInput>;
  }

  return baseInput;
};

export const Password = (props: InputProps) => {
  return <Input {...props} isPassword={true} />;
};

const baseClasses = {
  input: ["input", "rounded", "text-xl", "p-2"].join(" "),
  errorMessage: [
    "flex",
    "items-center",
    "gap-1",
    "text-sm",
    "mt-1",
    "ps-2"
  ].join(" "),
};
