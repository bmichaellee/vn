import { useRef } from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useFocusTrap } from "./useFocusTrap";

const Trap = () => {
  const trapRef = useRef<HTMLDivElement>(null);
  useFocusTrap(trapRef);
  return <div ref={trapRef} tabIndex={-1} />;
};

const DetachedTrap = () => {
  const trapRef = useRef<HTMLDivElement>(null);
  useFocusTrap(trapRef);
  return null;
};

describe("hook useFocusTrap", () => {
  it("does nothing when the ref is not attached", async () => {
    const user = userEvent.setup();
    const { getByText } = render(
      <>
        <button>Outside</button>
        <DetachedTrap />
      </>,
    );

    await user.tab();

    expect(getByText("Outside")).toHaveFocus();
  });

  it("blocks keyboard/tab focus from reaching content outside the trap", async () => {
    const user = userEvent.setup();
    const { getByText } = render(
      <>
        <button>Outside</button>
        <Trap />
      </>,
    );
    const outside = getByText("Outside");

    await user.tab();

    expect(outside).not.toHaveFocus();
  });
});
