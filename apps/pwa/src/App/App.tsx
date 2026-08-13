import { useEffect, useState } from "react";

import { AppService } from "@Services";
import { Version } from "@Components/Version";

export const App = () => {
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
    "bg-gray-100",
  ].join(" "),
  header: ["text-4xl", "font-bold", "text-gray-800"].join(" "),
  paragraph: ["mt-4", "text-lg", "text-gray-600"].join(" "),
};
