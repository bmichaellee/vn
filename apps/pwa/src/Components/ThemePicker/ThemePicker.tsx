import { ThemeService, useTheme } from "@Services";

export const ThemePicker = () => {

  const themes = Object.values(ThemeService.availableThemes);

  const { theme, setTheme } = useTheme();

  const handleSetTheme = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = event.target.value;
    setTheme(selectedTheme);
  };

  return (
    <>
    <select aria-label="Theme Picker" value={ theme?.value } onChange={ handleSetTheme }>
      { themes.map(({ name, value }) => (
        <option key={ value } value={ value }>{ name }</option>
      )) }
    </select>
    <span>{`current theme: ${theme?.value || "undefined"}`}</span>
    </>
  );
}
