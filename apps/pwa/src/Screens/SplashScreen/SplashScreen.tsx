import { Button } from "@Components/Button";
import { AppService } from "@Services";
import { Bot } from "lucide-react";
import { useNavigate } from "react-router";

export const SplashScreen = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className={classes.container}>
      <div className={classes.centered}>
        <Bot aria-label="app icon" className={classes.icon} />
        <span className={classes.tagline}>{AppService.TAGLINE}</span>
      </div>
      <div className={classes.buttons}>
        <Button onClick={handleLoginClick} className="w-screen max-w-xs">
          {AppService.LOGIN_BUTTON_TEXT}
        </Button>
      </div>
    </div>
  );
};

const classes = {
  container: ["flex", "h-screen", "w-screen", "flex-col", "gap-8", "py-8"].join(
    " ",
  ),
  centered: [
    "flex",
    "flex-col",
    "items-center",
    "justify-center",
    "gap-4",
    "flex-grow",
  ].join(" "),
  icon: ["h-32", "w-32"].join(" "),
  tagline: ["text-4xl", "font-semibold", "text-foreground"].join(" "),
  buttons: ["flex", "flex-col", "items-center", "gap-4"].join(" "),
};
