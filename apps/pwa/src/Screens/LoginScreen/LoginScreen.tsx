import { useState } from "react";
import { useNavigate } from "react-router";

import { AppService, AuthService, useAuth } from "@Services";

import { Input, Password } from "@Components/Input";
import { Button } from "@Components/Button";
import { useToast } from "@Components/Toast";

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

  const handleLogin = () => {
    AuthService.login(handle, password)
      .then((session) => {
        setSession(session);
        triggerToast({
          children: AuthService.LOGIN_SUCCESSFUL,
          variant: "success",
          vertical: "top",
          horizontal: "center",
        });
        navigate("/");
      })
      .catch((error) => {
        triggerToast({
          children: error.message,
          variant: "error",
          vertical: "top",
          horizontal: "center",
        });
      });
  };

  const loginDisabled = !handle || !password;

  return (
    <div className={classes.container}>
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
      <Button disabled={loginDisabled} onClick={handleLogin}>
        Log In
      </Button>
    </div>
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
