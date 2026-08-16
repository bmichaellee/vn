import { useRef } from "react";

import {
  useBlockOutsideClicks,
  useBlockOutsideScroll,
  useFocusTrap,
  usePresence,
} from "@Hooks";

import { useBackdrop } from "./provider";

const TRANSITION_MS = 400;

export interface BackdropProps {
  children?: React.ReactNode;
  persistent?: boolean;
}

export const Backdrop = ({ children, persistent }: BackdropProps) => {
  const { active, setActive } = useBackdrop();
  const { mounted, visible } = usePresence(active, TRANSITION_MS);

  const backdropRef = useRef<HTMLDivElement>(null);
  const blockInputRef = active ? backdropRef : { current: null };

  useFocusTrap(blockInputRef);
  useBlockOutsideClicks(blockInputRef);
  useBlockOutsideScroll(blockInputRef);

  const handleDismissBackdrop = () => {
    if (!active || persistent) return;
    setActive(false);
  };

  const innerContainerClasses = [
    classes.innerContainer,
    visible ? classes.active : classes.inactive,
  ].join(" ");

  if (!mounted) return null;

  return (
    <div className={classes.backdropContainer} ref={backdropRef} tabIndex={-1}>
      <div className={innerContainerClasses}>
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
