import { afterEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Input, Password } from "./Input";

const mock_onChange = vi.fn();

afterEach(() => {
  vi.clearAllMocks();
});

describe("<Input />", () => {
  it("accepts classNames to extend styling", () => {
    const { getByRole } = render(<Input className="test-class" />);
    const input = getByRole("textbox");
    expect(input).toHaveClass("test-class");
  });

  it("supports label text", () => {
    const { getByLabelText } = render(<Input label="Test Label" />);
    const input = getByLabelText("Test Label");
    expect(input).toBeInTheDocument();
  });

  it("supports placeholder text", () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Test Placeholder" />,
    );
    const input = getByPlaceholderText("Test Placeholder");
    expect(input).toBeInTheDocument();
  });

  it("supports value binding", async () => {
    const user = userEvent.setup();
    const { getByDisplayValue } = render(
      <Input value="Test Value" onChange={mock_onChange} />,
    );
    const input = getByDisplayValue("Test Value");
    expect(input).toBeInTheDocument();
    await user.type(input, " New Text");
    expect(mock_onChange).toHaveBeenCalled();
  });

  it("exports a <Password /> variant", () => {
    const { getByRole } = render(<Password />);
    const input = getByRole("textbox");
    expect(input).toHaveAttribute("type", "password");
  });

  it("exposes an error-state styling hook and displays errors below", () => {
    const { getByRole, getByText } = render(
      <Input error="There was an error" />,
    );
    const input = getByRole("textbox");
    expect(input).toHaveClass("input--error");
    const errorMessage = getByText("There was an error");
    expect(errorMessage).toBeInTheDocument();
  });
});
