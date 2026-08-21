import { useNavigate } from "react-router";

import { Button } from "@Components/Button";
import { AuthService, useAuth } from "@Services";

export const HomeScreen = () => {
  const { session, setSession } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.logout().then(() => {
      setSession(null);
      navigate("/");
    });
  };

  return (
    <div className={classes.container}>
      {`Welcome, ${session?.user?.handle}`}
      <Button onClick={handleLogout}>Log Out</Button>
    </div>
  );
};

const classes = {
  container: [
    "flex",
    "flex-col",
    "gap-4",
    "h-screen",
    "w-screen",
    "items-center",
    "justify-center",
  ].join(" "),
};
