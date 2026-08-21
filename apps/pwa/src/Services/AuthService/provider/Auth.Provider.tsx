import { useEffect, useState } from "react";

import { AuthService } from "../Auth.Service";
import { AuthContext } from "./Auth.Context";

import type { ReactNode } from "react";
import type { Session } from "../Auth.Service";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    AuthService.getSession().then(setSession);
  }, []);

  return (
    <AuthContext.Provider value={{ session }}>{children}</AuthContext.Provider>
  );
};
