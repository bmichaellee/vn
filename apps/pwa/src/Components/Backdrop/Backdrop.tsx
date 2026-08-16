import { useRef } from "react";

import {
  useBlockOutsideClicks,
  useBlockOutsideScroll,
  useFocusTrap,
} from "@Hooks";

import { useBackdrop } from "./provider";

import "./Backdrop.styles.css";

interface BackdropProps {
  children: React.ReactNode;
}

export const Backdrop = ({ children }: BackdropProps) => {
  const { active } = useBackdrop();

  const backdropRef = useRef<HTMLDivElement>(null);
  const blockInputRef = active ? backdropRef : null;

  useFocusTrap(blockInputRef);
  useBlockOutsideClicks(blockInputRef);
  useBlockOutsideScroll(blockInputRef);

  const innerContainerClasses = [
    classes.innerContainer,
    active ? classes.active : classes.inactive,
  ].join(" ");

  return (
    <div
      ref={backdropRef}
      role="presentation"
      tabIndex={-1}
      className={classes.backdrop}
    >
      <div className={innerContainerClasses}>{children}</div>
    </div>
  );
};

const classes = {
  backdrop: ["fixed", "inset-0", "z-50"].join(" "),
  innerContainer: [
    "flex",
    "items-center",
    "justify-center",
    "w-full",
    "h-full",
    "bg-black/50",
    "transition-opacity",
    "duration-400",
  ].join(" "),
  active: ["opacity-100"],
  inactive: ["opacity-0"],
};
