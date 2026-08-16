import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Backdrop as BaseBackdrop } from "./Backdrop";

const mock_useFocusTrap = vi.hoisted(() => vi.fn());

vi.mock("@Hooks", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  useFocusTrap: mock_useFocusTrap,
}));

const Backdrop = () => <BaseBackdrop children={null} />;

describe("<Backdrop />", () => {
  it("renders a full-screen, non-scrolling semitransparent black overlay", () => {
    const { getByRole } = render(<Backdrop />);
    const backdrop = getByRole("presentation");
    expect(backdrop).toHaveClass("fixed inset-0 z-50 bg-black/50");
  });

  it.todo("fades in on activation");
  it.todo("fades out on dismissal");
  it.todo("dismisses when tapped");
  it.todo("does not dismiss on tap when blocking");

  it("blocks clicks on content behind it", async () => {
    const user = userEvent.setup();
    const mock_onClick = vi.fn();
    const { getByText } = render(
      <>
        <button onClick={mock_onClick}>Behind</button>
        <Backdrop />
      </>,
    );

    await user.click(getByText("Behind"));

    expect(mock_onClick).not.toHaveBeenCalled();
  });

  it("traps focus on itself (via useFocusTrap)", () => {
    const { getByRole } = render(<Backdrop />);
    const backdrop = getByRole("presentation");

    expect(mock_useFocusTrap).toHaveBeenCalledWith(
      expect.objectContaining({ current: backdrop }),
    );
  });

  it.todo("blocks scrolling of content behind it");
});
