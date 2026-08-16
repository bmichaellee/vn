import { useRef } from "react";

import {
  useBlockOutsideClicks,
  useBlockOutsideScroll,
  useFocusTrap,
} from "@Hooks";

import { useBackdrop } from "./provider";

export interface BackdropProps {
  children?: React.ReactNode;
  persistent?: boolean;
}

export const Backdrop = ({ children, persistent }: BackdropProps) => {
  const { active, setActive } = useBackdrop();

  const backdropRef = useRef<HTMLDivElement>(null);
  const blockInputRef = backdropRef;

  useFocusTrap(blockInputRef);
  useBlockOutsideClicks(blockInputRef);
  useBlockOutsideScroll(blockInputRef);

  const handleDismissBackdrop = () => {
    if (!active || persistent) return;
    setActive(false);
  };

  const innerContainerClasses = [
    classes.innerContainer,
    active ? classes.active : classes.inactive,
  ].join(" ");

  return (
    <div
      className={classes.backdropContainer}
      ref={active ? backdropRef : null}
      tabIndex={-1}
    >
      <div
        className={innerContainerClasses}
      >
        <div
          className={classes.overlay}
          onClick={handleDismissBackdrop}
          role="presentation"
        />
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
};

const classes = {
  backdropContainer: ["fixed", "inset-0", "z-50"].join(" "),
  innerContainer: [
    "flex",
    "items-center",
    "justify-center",
    "w-full",
    "h-full",
    "transition-opacity",
    "duration-400",
    "ease-in-out",
  ].join(" "),
  active: ["opacity-100"],
  inactive: ["opacity-0"],
  overlay: ["absolute", "inset-0", "bg-black/50"].join(" "),
};
