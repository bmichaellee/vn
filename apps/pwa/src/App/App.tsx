import { ThemeProvider } from "@Services";
import { BackdropProvider } from "@Components/Backdrop";

import { TemporaryLayout } from "./TemporaryLayout";
import { ToastProvider } from "@Components/Toast";

export const App = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BackdropProvider>
          <TemporaryLayout />
        </BackdropProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};
