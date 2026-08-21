import { afterEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Dropdown } from "./Dropdown";

const fixture_options = ["Alpha", "Beta", "Gamma"];

const mock_onChange = vi.fn();

afterEach(() => {
  vi.clearAllMocks();
});

describe("<Dropdown />", () => {
  it("renders the provided options list", () => {
    const { getAllByRole } = render(<Dropdown options={fixture_options} />);
    const options = getAllByRole("option");
    expect(options.map((option) => option.textContent)).toEqual(
      fixture_options,
    );
  });

  it("accepts object-based options with value and label", () => {
    const { getAllByRole } = render(
      <Dropdown
        options={[
          { value: "alpha", label: "Alpha" },
          { value: "beta", label: "Beta" },
          { value: "gamma", label: "Gamma" },
        ]}
      />,
    );
    const options = getAllByRole("option");
    expect(options.map((option) => option.textContent)).toEqual(
      fixture_options,
    );
  });

  it("accepts and displays a label parameter, and displays it in a label element", () => {
    const { getByLabelText, getByText } = render(
      <Dropdown options={fixture_options} label="Test Label" />,
    );
    const select = getByLabelText("Test Label");
    expect(select).toBeInTheDocument();
    const labelElement = getByText("Test Label");
    expect(labelElement.tagName).toBe("LABEL");
  });

  it("shows the current value", () => {
    const { getByRole } = render(
      <Dropdown options={fixture_options} value="Beta" />,
    );
    const select = getByRole("combobox");
    expect(select).toHaveValue("Beta");
  });

  it("calls the change handler when an option is picked", async () => {
    const user = userEvent.setup();
    const { getByRole } = render(
      <Dropdown options={fixture_options} onChange={mock_onChange} />,
    );
    await user.selectOptions(getByRole("combobox"), "Beta");
    expect(mock_onChange).toHaveBeenCalledWith("Beta");
  });
});
