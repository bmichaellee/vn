import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Version } from "./Version";

describe("<Version />", () => {
  it("renders the app version as a fragment with no html elements", () => {
    const { container } = render(<Version />);

    expect(container.firstElementChild).toBeNull();
    expect(container.textContent).not.toBe("");
  });
});
