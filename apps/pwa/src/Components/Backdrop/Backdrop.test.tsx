import { act, useEffect } from "react";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { BackdropProvider, useBackdrop } from "./provider";
import { Backdrop, Backdrop as BackdropBase } from "./Backdrop";

import type { BackdropProps } from "./Backdrop";

const { useFocusTrap: mock_useFocusTrap,
  useBlockOutsideClicks: mock_useBlockOutsideClicks,
  useBlockOutsideScroll: mock_useBlockOutsideScroll
} = vi.hoisted(() => ({
  useFocusTrap: vi.fn(),
  useBlockOutsideClicks: vi.fn(),
  useBlockOutsideScroll: vi.fn(),
}));

vi.mock("@Hooks", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  useFocusTrap: mock_useFocusTrap,
  useBlockOutsideClicks: mock_useBlockOutsideClicks,
  useBlockOutsideScroll: mock_useBlockOutsideScroll,
}));

beforeEach(() => {
  vi.clearAllMocks();
});

const Consumer = ({ active, ...props }: { active?: boolean } & BackdropProps) => {
  const { setActive } = useBackdrop();

  useEffect(() => {
    setActive(active ?? false);
  }, [active]);

  return (
    <>
      <Backdrop {...props}>
        <p>children</p>
      </Backdrop>
      <button onClick={() => setActive(true)}>Activate</button>
      <button onClick={() => setActive(false)}>Dismiss</button>
    </>
  );
};

const AppWithBackdrop = ({ active, persistent, ...props }: { active?: boolean; persistent?: boolean } & BackdropProps) => (
  <BackdropProvider>
    <Consumer active={active} persistent={persistent} {...props} />
  </BackdropProvider>
);

describe("<Backdrop />", () => {
  it("renders a full-screen, non-scrolling overlay", () => {
    const { container, getByRole } = render(<AppWithBackdrop />);
    const backdropContainer = container.firstChild;
    const overlay = getByRole("presentation");

    expect(backdropContainer).toHaveClass("fixed inset-0 z-50");
    expect(overlay).toHaveClass("absolute inset-0 bg-black/50");
  });

  it("dismisses when tapping outside the content unless persistent", async () => {
    const user = userEvent.setup();
    const { getByRole, getByText } = render(<AppWithBackdrop active />);
    const innerContainer = getByRole("presentation").parentElement;

    await user.click(getByText("children"));
    expect(innerContainer).toHaveClass("opacity-100");

    await user.click(getByRole("presentation"));
    expect(innerContainer).toHaveClass("opacity-0");

  });

  it("does not dismiss when persistent", async () => {
    const user = userEvent.setup();
    const { getByRole, getByText } = render(<AppWithBackdrop active persistent />);
    const innerContainerPersistent = getByRole("presentation").parentElement;

    await user.click(getByText("children"));
    expect(innerContainerPersistent).toHaveClass("opacity-100");

    await user.click(getByRole("presentation"));
    expect(innerContainerPersistent).toHaveClass("opacity-100");
  });

  it("traps focus, blocks scrolling, and blocks clicks behind it only when active", () => {
    const { container } = render(<AppWithBackdrop active />);
    const backdropActive = container.firstChild;

    expect(mock_useFocusTrap).toHaveBeenCalledWith(
      expect.objectContaining({ current: backdropActive }),
    );
    expect(mock_useBlockOutsideScroll).toHaveBeenCalledWith(
      expect.objectContaining({ current: backdropActive }),
    );
    expect(mock_useBlockOutsideClicks).toHaveBeenCalledWith(
      expect.objectContaining({ current: backdropActive }),
    );

    render(<AppWithBackdrop />);

    expect(mock_useFocusTrap).toHaveBeenCalledWith({ current: null });
    expect(mock_useBlockOutsideScroll).toHaveBeenCalledWith({ current: null });
    expect(mock_useBlockOutsideClicks).toHaveBeenCalledWith({ current: null });
  });
});
