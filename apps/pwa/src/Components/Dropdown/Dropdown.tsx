import "./Dropdown.styles.css";

interface DropdownOptionObject {
  value: string;
  label: string;
}

export type DropdownOption = string | DropdownOptionObject;

export interface DropdownProps {
  options: DropdownOption[];
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export const Dropdown = ({
  options,
  label,
  value,
  onChange,
}: DropdownProps) => {
  const select = (
    <select
      className="dropdown rounded"
      aria-label={label}
      defaultValue={value}
      onChange={(e) => onChange?.(e.target.value)}
    >
      {options.map((option) =>
        typeof option === "string" ? (
          <option key={option} value={option}>
            {option}
          </option>
        ) : (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ),
      )}
    </select>
  );

  if (label) {
    return (
      <label className="flex flex-col gap-1 font-medium ps-2">
        {label}
        {select}
      </label>
    );
  }

  return select;
};
