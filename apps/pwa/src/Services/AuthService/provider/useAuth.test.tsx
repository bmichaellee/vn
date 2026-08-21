import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";

import { useAuth } from "./useAuth";

describe("useAuth", () => {
  it("returns a null session outside an AuthProvider", () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current).toEqual({ session: null });
  });
});
