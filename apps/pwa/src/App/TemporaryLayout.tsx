import { useEffect, useState } from "react";

import { AppService } from "@Services";

import { Version } from "@Components/Version";
import { ThemePicker } from "@Components/ThemePicker";
import { CodeBlock } from "@Components/CodeBlock";
import { Button } from "@Components/Button";

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
        <CodeBlock>{healthCheck}</CodeBlock>
      </div>
      <div>
        <p>Theme Picker:</p>
        <ThemePicker />
      </div>
      <Button title="Primary" onClick={() => {}} />
      <Button title="Secondary" secondary onClick={() => {}} />
      <Button title="Disabled" disabled />
      <Button title="Destructive" destructive onClick={() => {}} />
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
  header: ["text-4xl", "font-bold", "text-foreground"].join(" "),
  paragraph: ["mt-4", "text-lg", "text-muted"].join(" "),
};
