import { useRef } from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";

import { useBlockOutsideScroll } from "./useBlockOutsideScroll";

const Blocker = ({ children }: { children?: React.ReactNode }) => {
  const blockerRef = useRef<HTMLDivElement>(null);
  useBlockOutsideScroll(blockerRef);
  return <div ref={blockerRef}>{children}</div>;
};

const scroll = (target: Element) =>
  target.dispatchEvent(
    new WheelEvent("wheel", { bubbles: true, cancelable: true }),
  );

describe("hook useBlockOutsideScroll", () => {
  it("blocks scrolling of content outside the container", () => {
    const { getByText } = render(
      <>
        <p>Outside</p>
        <Blocker />
      </>,
    );

    const allowed = scroll(getByText("Outside"));

    expect(allowed).toBe(false);
  });

  it("still allows scrolling of content inside the container", () => {
    const { getByText } = render(
      <Blocker>
        <p>Inside</p>
      </Blocker>,
    );

    const allowed = scroll(getByText("Inside"));

    expect(allowed).toBe(true);
  });
});
