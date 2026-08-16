import { useState } from "react";
import { BackdropContext, BackdropContextValue } from "./Backdrop.Context";

interface BackdropProviderProps {
  children?: React.ReactNode;
}

export const BackdropProvider = ({ children }: BackdropProviderProps) => {
  const [active, setActive] = useState(false);
  const contextValue: BackdropContextValue = { active, setActive };

  return (
    <BackdropContext.Provider value={contextValue}>
      {children}
    </BackdropContext.Provider>
  );
};
