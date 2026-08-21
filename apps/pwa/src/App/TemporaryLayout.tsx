import { useEffect, useState } from "react";
import { AppService, ThemeService, useTheme } from "@Services";

import { Version } from "@Components/Version";
import { Dropdown } from "@Components/Dropdown";
import { CodeBlock } from "@Components/CodeBlock";
import { Button } from "@Components/Button";
import { Input, Password } from "@Components/Input";
import { useToast } from "@Components/Toast";
import { Backdrop, useBackdrop } from "@Components/Backdrop";

import type { ToastProps } from "@Components/Toast";

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

  const themes = Object.values(ThemeService.availableThemes);
  const { theme, setTheme } = useTheme();

  const { setActive } = useBackdrop();
  const { triggerToast } = useToast();

  useEffect(() => {
    setActive(true);
  }, [setActive]);

  const handleTriggerToast = () => {
    const pick = <T,>(options: T[]) =>
      options[Math.floor(Math.random() * options.length)];

    const variant = pick(["info", "success", "warning", "error"] as const);

    const toast: ToastProps = {
      variant,
      vertical: pick(["top", "middle", "bottom"] as const),
      horizontal: pick(["left", "center", "right"] as const),
      children: `I'm a ${variant} toast!`,
    };

    triggerToast(toast);
  };

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
        <Dropdown
          label="Theme Picker"
          value={theme?.value}
          onChange={setTheme}
          options={themes.map(({ name, value }) => ({ value, label: name }))}
        />
      </div>
      <Input label="Username" />
      <Password label="Password" />
      <Input label="Error" error="There was an error" />
      <Button title="Primary" onClick={() => {}} />
      <Button title="Secondary" secondary onClick={() => {}} />
      <Button title="Disabled" disabled />
      <Button title="Destructive" destructive onClick={() => {}} />
      <Button title="Trigger Toast" onClick={handleTriggerToast} />
      <Backdrop persistent>
        <div
          className="bg-background p-4 rounded shadow-lg"
          style={{
            padding: "1rem",
            borderRadius: "0.5rem",
          }}
        >
          <h2>Backdrop Content</h2>
          <p>This is some content inside the backdrop.</p>
          <p>Click outside this box to dismiss the backdrop.</p>
          <Button
            title="Dismiss"
            onClick={() => {
              setActive(false);
              triggerToast({
                horizontal: "center",
                vertical: "bottom",
                variant: "success",
                children: "I'm a toast!",
              });
              triggerToast({
                horizontal: "left",
                vertical: "top",
                variant: "error",
                children: "I'm an error toast!",
              });
            }}
          />
        </div>
      </Backdrop>
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
