import { useState } from "react";
import { useNavigate } from "react-router";

import { AppService, AuthService, useAuth } from "@Services";

import { Input, Password } from "@Components/Input";
import { Button } from "@Components/Button";
import { ToastProps, useToast } from "@Components/Toast";

import type { SubmitEvent } from "react";
import type { InputChangeEvent } from "@Components/Input";

export const LoginScreen = () => {
  const [handle, setHandle] = useState("");
  const [password, setPassword] = useState("");

  const handleChangeHandle = ({ target: { value } }: InputChangeEvent) =>
    setHandle(value);
  const handleChangePassword = ({ target: { value } }: InputChangeEvent) =>
    setPassword(value);

  const { triggerToast } = useToast();
  const { setSession } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (event: SubmitEvent) => {
    event.preventDefault();

    const toast: ToastProps = {
      vertical: "top",
      horizontal: "center",
    };
    AuthService.login(handle, password)
      .then(({ message, session }) => {
        setSession(session);
        toast.children = message;
        toast.variant = "success";
        navigate("/");
      })
      .catch(({ message }) => {
        toast.children = message;
        toast.variant = "error";
      })
      .finally(() => {
        triggerToast(toast);
      });
  };

  const loginDisabled = !handle || !password;

  return (
    <form className={classes.container} onSubmit={handleLogin}>
      <span className={classes.appName}>{AppService.APP_NAME}</span>
      <Input
        autoFocus
        placeholder="Handle"
        value={handle}
        onChange={handleChangeHandle}
      />
      <Password
        placeholder="Password"
        value={password}
        onChange={handleChangePassword}
      />
      <Button disabled={loginDisabled} type="submit">
        Log In
      </Button>
    </form>
  );
};

const classes = {
  container: [
    "flex",
    "h-screen",
    "w-screen",
    "flex-col",
    "gap-4",
    "items-center",
    "justify-center",
  ].join(" "),
  appName: ["text-2xl", "font-bold"].join(" "),
};
