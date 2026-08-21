import { useContext } from "react";

import { AuthContext } from "./Auth.Context";

export const useAuth = () =>
  useContext(AuthContext) ?? { session: null, setSession: () => {} };
