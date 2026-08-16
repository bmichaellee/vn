import { ThemeProvider } from "@Services";
import { BackdropProvider } from "@Components/Backdrop";

import { TemporaryLayout } from "./TemporaryLayout";

export const App = () => {
  return (
    <ThemeProvider>
      <BackdropProvider>
        <TemporaryLayout />
      </BackdropProvider>
    </ThemeProvider>
  );
};
