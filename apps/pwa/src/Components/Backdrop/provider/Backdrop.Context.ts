import { createContext } from "react";

export interface BackdropContextValue {
  active: boolean;
  setActive: (active: boolean) => void;
}

export const BackdropContext = createContext<BackdropContextValue | undefined>(
  undefined,
);
