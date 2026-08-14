import { useEffect, useState } from "react";
import { Version } from "@Components/Version";
import { ThemePicker } from "@Components/ThemePicker";

import { AppService } from "@Services";

export const TemporaryLayout = () => {
  const [healthCheck, setHealthCheck] = useState<string | null>(null);

  useEffect(() => {
    AppService.getHealth()
      .then((response) => {
        setHealthCheck(JSON.stringify(response));
      })
      .catch((error) => {
        setHealthCheck(`Error: ${error.message}`);
      });
  }, []);

  return (
    <div className={classes.container}>
      <h1 className={classes.header}>Welcome to the PWA App!</h1>
      <p className={classes.paragraph}>
        This is a simple Progressive Web App built with React and TypeScript.
      </p>
      <span>
        <Version />
      </span>
      <div>
        <p>Health Check:</p>
        <code>{healthCheck}</code>
      </div>
      <div>
        <p>Theme Picker:</p>
        <ThemePicker />
      </div>
    </div>
  );
};

const classes = {
  container: [
    "flex",
    "flex-col",
    "items-center",
    "justify-center",
    "min-h-screen",
    "bg-background",
  ].join(" "),
  header: ["text-4xl", "font-bold", "text-gray-800"].join(" "),
  paragraph: ["mt-4", "text-lg", "text-gray-600"].join(" "),
};
