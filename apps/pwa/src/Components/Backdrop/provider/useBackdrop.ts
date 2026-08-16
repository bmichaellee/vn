import { useContext } from "react";

import { BackdropContext } from "./Backdrop.Context";

import type { BackdropContextValue } from "./Backdrop.Context";

export const useBackdrop = (): BackdropContextValue => {
  const context = useContext(BackdropContext);
  if (!context) {
    throw new Error("useBackdrop must be used within a BackdropProvider");
  }
  return context;
};
