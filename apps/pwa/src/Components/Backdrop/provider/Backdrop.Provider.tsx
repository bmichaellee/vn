import { BackdropContext } from "./Backdrop.Context";

interface BackdropProviderProps {
  children?: React.ReactNode;
}

export const BackdropProvider = ({ children }: BackdropProviderProps) => (
  <BackdropContext.Provider value={undefined}>
    {children}
  </BackdropContext.Provider>
);
