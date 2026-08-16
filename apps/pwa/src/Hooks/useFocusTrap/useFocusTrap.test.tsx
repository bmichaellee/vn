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

describe("hook useFocusTrap", () => {
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
