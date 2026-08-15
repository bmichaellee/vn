import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import { Bot } from "lucide-react";

import "@Services";

import { Button } from "./Button";

const mock_onClick = vi.fn();

beforeEach(() => {
  vi.resetAllMocks();
});

describe("<Button />", () => {
  it("renders without props or context and accepts className overrides", () => {
    const { getAllByRole } = render(
      <>
        <Button />
        <Button className="test-class" />
      </>,
    );

    expect(getAllByRole("button")[0]).toBeInTheDocument();
    expect(getAllByRole("button")[1]).toHaveClass("test-class");
  });

  it("uses theme-based styling with overrides", () => {
    const { getAllByRole } = render(
      <>
        <Button />
        <Button secondary />
        <Button destructive />
        <Button secondary destructive />
        <Button primary secondary />
      </>,
    );

    const buttonNames = [
      "no props",
      "secondary",
      "destructive",
      "secondary destructive",
      "primary secondary",
    ];

    const buttons = Object.fromEntries(
      getAllByRole("button").map((button, index) => [
        buttonNames[index],
        button,
      ]),
    );

    expect(buttons["no props"]).toHaveClass("bg-(--primary)");
    expect(buttons["secondary"]).toHaveClass("bg-(--secondary)");
    expect(buttons["destructive"]).toHaveClass("bg-(--destructive)");
    expect(buttons["secondary destructive"]).toHaveClass("bg-(--destructive)");
    expect(buttons["primary secondary"]).toHaveClass("bg-(--primary)");
  });

  it("renders the provided title, or children, not both, and a default if neither are given", () => {
    const { getAllByRole } = render(
      <>
        <Button title="Join AVALANCHE" />
        <Button>Advent Children</Button>
        <Button title="Launch the Highwind">Crash the Highwind</Button>
        <Button />
      </>,
    );

    const buttons = getAllByRole("button");
    expect(buttons[0]).toHaveTextContent("Join AVALANCHE");
    expect(buttons[1]).toHaveTextContent("Advent Children");
    expect(buttons[2]).toHaveTextContent("Launch the Highwind");
    expect(buttons[2]).not.toHaveTextContent("Crash the Highwind");
    expect(buttons[3]).toHaveTextContent("Button");
  });

  it("renders an icon when provided, and does not render the default text", () => {
    const { getByRole } = render(<Button icon={<Bot />} />);
    const button = getByRole("button");
    expect(button).toContainHTML("<svg");
    expect(button).not.toHaveTextContent("Button");
  });

  it("calls the tap/click handler when clicked", async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<Button onClick={mock_onClick} />);
    const button = getByRole("button");
    await user.click(button);
    expect(mock_onClick).toHaveBeenCalled();
  });

  it("appears disabled when disabled or no handler is provided", async () => {
    const user = userEvent.setup();
    const { getAllByRole } = render(
      <>
        <Button disabled onClick={mock_onClick} />
        <Button />
      </>,
    );

    const button = getAllByRole("button");
    await user.click(button[0]);
    expect(mock_onClick).not.toHaveBeenCalled();
    expect(button[1]).toBeDisabled();
  });
});
