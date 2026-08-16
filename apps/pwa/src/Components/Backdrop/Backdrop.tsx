import { useRef } from "react";

import { useFocusTrap } from "@Hooks";

import "./Backdrop.styles.css";

interface BackdropProps {
  children: React.ReactNode;
}

export const Backdrop = ({ children }: BackdropProps) => {
  const backdropRef = useRef<HTMLDivElement>(null);
  useFocusTrap(backdropRef);

  return (
    <div
      ref={backdropRef}
      role="presentation"
      tabIndex={-1}
      className={classes.backdrop}
    >
      {children}
    </div>
  );
};

const classes = {
  backdrop: [
    "fixed",
    "inset-0",
    "z-50",
    "bg-black/50",
    "flex",
    "items-center",
    "justify-center",
  ].join(" "),
};
