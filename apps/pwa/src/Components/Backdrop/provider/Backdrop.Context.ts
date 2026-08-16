import { createContext } from "react";

export interface BackdropContextValue {
  // Types go here
}

export const BackdropContext = createContext<BackdropContextValue | undefined>(
  undefined,
);
