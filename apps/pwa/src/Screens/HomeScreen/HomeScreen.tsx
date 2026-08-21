import { useAuth } from "@Services";

export const HomeScreen = () => {
  const { session } = useAuth();

  return (
    <div className={classes.container}>
      {`Welcome, ${session?.user?.handle}`}
    </div>
  );
};

const classes = {
  container: [
    "flex",
    "h-screen",
    "w-screen",
    "items-center",
    "justify-center",
  ].join(" "),
};
