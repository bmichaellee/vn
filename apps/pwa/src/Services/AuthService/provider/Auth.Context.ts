import { createContext } from "react";

// We don't know what the AuthContextValue looks like yet, so just use any for now
type AuthContextValue = any;

export const AuthContext = createContext<AuthContextValue | null>(null);
