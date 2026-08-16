import { describe, expect, it } from "vitest";

import { useIntentColor } from "./useIntentColor";

describe("hook useIntentColor", () => {
  it("resolves secondary and destructive to their theme colors", () => {
    expect(useIntentColor({ secondary: true })).toBe("--secondary");
    expect(useIntentColor({ destructive: true })).toBe("--destructive");
  });

  it("applies destructive > secondary > primary precedence when multiple intents are set", () => {
    expect(useIntentColor({ destructive: true, secondary: true })).toBe("--destructive");
    expect(useIntentColor({ secondary: true })).toBe("--secondary");
    expect(useIntentColor()).toBe("--primary");
  });
});
