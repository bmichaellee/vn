import { useEffect } from "react";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";

import { BackdropProvider, useBackdrop } from "./provider";
import { Backdrop as BackdropBase } from "./Backdrop";
const mock_useFocusTrap = vi.hoisted(() => vi.fn());
const mock_useBlockOutsideClicks = vi.hoisted(() => vi.fn());
const mock_useBlockOutsideScroll = vi.hoisted(() => vi.fn());

vi.mock("@Hooks", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  useFocusTrap: mock_useFocusTrap,
  useBlockOutsideClicks: mock_useBlockOutsideClicks,
  useBlockOutsideScroll: mock_useBlockOutsideScroll,
}));

beforeEach(() => {
  vi.clearAllMocks();
});

const Backdrop = () => (
  <BackdropProvider>
    <BackdropBase>children</BackdropBase>
  </BackdropProvider>
);

const Consumer = () => {
  const { setActive } = useBackdrop();

  useEffect(() => {
    setActive?.(true);
  }, [setActive]);

  return <BackdropBase>children</BackdropBase>;
};

const ConsumerWithBackdrop = () => (
  <BackdropProvider>
    <Consumer />
  </BackdropProvider>
);

describe("<Backdrop />", () => {
  it("renders a full-screen, non-scrolling overlay and black semitransparent inner container", () => {
    const { getByRole } = render(<Backdrop />);
    const backdrop = getByRole("presentation");
    const innerContainer = backdrop.querySelector("div");

    expect(backdrop).toHaveClass("fixed inset-0 z-50");
    expect(innerContainer).toHaveClass(
      "flex items-center justify-center w-full h-full bg-black/50",
    );
  });

  it.todo("fades in on activation");
  it.todo("fades out on dismissal");
  it.todo("dismisses when tapped");
  it.todo("does not dismiss on tap when blocking");

  it("traps focus, blocks scrolling, and blocks clicks behind it only when active", () => {
    const { getByRole: getByRoleActive } = render(<ConsumerWithBackdrop />);
    const backdropActive = getByRoleActive("presentation");

    expect(mock_useFocusTrap).toHaveBeenCalledWith(
      expect.objectContaining({ current: backdropActive }),
    );
    expect(mock_useBlockOutsideScroll).toHaveBeenCalledWith(
      expect.objectContaining({ current: backdropActive }),
    );
    expect(mock_useBlockOutsideClicks).toHaveBeenCalledWith(
      expect.objectContaining({ current: backdropActive }),
    );

    render(<Backdrop />);

    expect(mock_useFocusTrap).toHaveBeenCalledWith(null);
    expect(mock_useBlockOutsideScroll).toHaveBeenCalledWith(null);
    expect(mock_useBlockOutsideClicks).toHaveBeenCalledWith(null);
  });
});
