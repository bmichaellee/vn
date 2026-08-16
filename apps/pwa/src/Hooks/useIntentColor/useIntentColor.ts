interface IntentProps {
  secondary?: boolean;
  destructive?: boolean;
}

export const useIntentColor = (
  {
    secondary,
    destructive,
  }: IntentProps = {},
) => {

  const themeColor = destructive
    ? "--destructive"
    : secondary
      ? "--secondary"
      : "--primary";

  return themeColor;
};
