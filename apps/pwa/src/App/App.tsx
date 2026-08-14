import { ThemeProvider } from "@Services";

import { TemporaryLayout } from "./TemporaryLayout";

export const App = () => {
  return (
    <ThemeProvider>
      <TemporaryLayout />
    </ThemeProvider>
  );
};
