import { createContext } from "react";

import type { Session } from "../Auth.Service";

interface AuthContextValue {
  session: Session | null;
  setSession: (session: Session | null) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
