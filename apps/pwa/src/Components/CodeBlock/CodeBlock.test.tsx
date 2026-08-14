import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";

import { CodeBlock } from "./CodeBlock";

describe("<CodeBlock />", () => {
  it("inherits className prop", () => {
    const { container } = render(
      <CodeBlock className="test-class">content</CodeBlock>,
    );
    expect(container.firstChild).toHaveClass("test-class");
    expect(container.firstChild).toHaveClass("code-block");
  });
});
