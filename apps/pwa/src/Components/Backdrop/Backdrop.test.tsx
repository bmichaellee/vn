import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";

import { Backdrop as BaseBackdrop } from "./Backdrop";

const mock_useFocusTrap = vi.hoisted(() => vi.fn());
const mock_useBlockOutsideClicks = vi.hoisted(() => vi.fn());
const mock_useBlockOutsideScroll = vi.hoisted(() => vi.fn());

vi.mock("@Hooks", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  useFocusTrap: mock_useFocusTrap,
  useBlockOutsideClicks: mock_useBlockOutsideClicks,
  useBlockOutsideScroll: mock_useBlockOutsideScroll,
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

  it("blocks clicks behind it (via useBlockOutsideClicks)", () => {
    const { getByRole } = render(<Backdrop />);
    const backdrop = getByRole("presentation");

    expect(mock_useBlockOutsideClicks).toHaveBeenCalledWith(
      expect.objectContaining({ current: backdrop }),
    );
  });

  it("traps focus on itself (via useFocusTrap)", () => {
    const { getByRole } = render(<Backdrop />);
    const backdrop = getByRole("presentation");

    expect(mock_useFocusTrap).toHaveBeenCalledWith(
      expect.objectContaining({ current: backdrop }),
    );
  });

  it("blocks scrolling behind it (via useBlockOutsideScroll)", () => {
    const { getByRole } = render(<Backdrop />);
    const backdrop = getByRole("presentation");

    expect(mock_useBlockOutsideScroll).toHaveBeenCalledWith(
      expect.objectContaining({ current: backdrop }),
    );
  });
});
