import { AuthProvider, ThemeProvider } from "@Services";
import { BackdropProvider } from "@Components/Backdrop";

import { Router } from "../Router";
import { ToastProvider } from "@Components/Toast";

export const App = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BackdropProvider>
          <AuthProvider>
            <Router />
          </AuthProvider>
        </BackdropProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};
