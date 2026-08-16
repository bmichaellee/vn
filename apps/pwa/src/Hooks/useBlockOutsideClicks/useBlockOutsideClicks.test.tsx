import { useRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useBlockOutsideClicks } from "./useBlockOutsideClicks";

const Blocker = () => {
  const blockerRef = useRef<HTMLDivElement>(null);
  useBlockOutsideClicks(blockerRef);
  return <div ref={blockerRef} />;
};

describe("useBlockOutsideClicks", () => {
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
});
