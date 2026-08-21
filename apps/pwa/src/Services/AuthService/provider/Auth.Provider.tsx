import { useEffect, useState } from "react";

import { AuthService } from "../Auth.Service";
import { AuthContext } from "./Auth.Context";

import type { ReactNode } from "react";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<unknown>(null);

  useEffect(() => {
    AuthService.getSession().then(setSession);
  }, []);

  return (
    <AuthContext.Provider value={{ session }}>{children}</AuthContext.Provider>
  );
};
