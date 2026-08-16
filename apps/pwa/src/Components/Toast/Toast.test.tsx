import { describe, it } from "vitest";
import { ToastProvider, useToast } from "./provider";

import type { ToastProps } from "./Toast";

const Consumer = (props: ToastProps) => {
  const { triggerToast } = useToast();

  const handleSpawnTestToast = () => {
    triggerToast({ ...props });
  };

  return (
    <>
      <div>children</div>
      <button onClick={handleSpawnTestToast}>Activate</button>
    </>
  );
};

const AppWithToasts = (props: ToastProps) => (
  <ToastProvider>
    <Consumer {...props} />
  </ToastProvider>
);

describe("<Toast />", () => {
  it.todo("appears overlaid without shifting page layout");
  it.todo("auto-dismisses success and info toasts");
  it.todo("persists the error variant until explicitly dismissed");
  it.todo("shows a visible dismiss control on the error variant");
  it.todo("uses theme-based styling");
  it.todo("is configurable to appear in the top, middle or bottom of the viewport");
  it.todo("is configurable to appear in the left, center, or right of the viewport");
  it.todo("shows an icon, or a default if none is provided");
});
