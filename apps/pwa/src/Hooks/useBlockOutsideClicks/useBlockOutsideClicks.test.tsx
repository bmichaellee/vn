import { useRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useBlockOutsideClicks } from "./useBlockOutsideClicks";

const Blocker = ({ children }: { children?: React.ReactNode }) => {
  const blockerRef = useRef<HTMLDivElement>(null);
  useBlockOutsideClicks(blockerRef);
  return <div ref={blockerRef}>{children}</div>;
};

const DetachedBlocker = () => {
  const blockerRef = useRef<HTMLDivElement>(null);
  useBlockOutsideClicks(blockerRef);
  return null;
};

describe("hook useBlockOutsideClicks", () => {
  it("does nothing when the ref is not attached", async () => {
    const user = userEvent.setup();
    const mock_onClick = vi.fn();
    const { getByText } = render(
      <>
        <button onClick={mock_onClick}>Outside</button>
        <DetachedBlocker />
      </>,
    );

    await user.click(getByText("Outside"));

    expect(mock_onClick).toHaveBeenCalled();
  });

  it("blocks clicks on content outside the container", async () => {
    const user = userEvent.setup();
    const mock_onClick = vi.fn();
    const { getByText } = render(
      <>
        <button onClick={mock_onClick}>Outside</button>
        <Blocker />
      </>,
    );

    await user.click(getByText("Outside"));

    expect(mock_onClick).not.toHaveBeenCalled();
  });

  it("still allows clicks on content inside the container", async () => {
    const user = userEvent.setup();
    const mock_onClick = vi.fn();
    const { getByText } = render(
      <Blocker>
        <button onClick={mock_onClick}>Inside</button>
      </Blocker>,
    );

    await user.click(getByText("Inside"));

    expect(mock_onClick).toHaveBeenCalled();
  });
});
