import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";

import { usePresence } from "./usePresence";

const DURATION_MS = 300;

const renderPresence = (active: boolean) =>
  renderHook(({ active }) => usePresence(active, DURATION_MS), {
    initialProps: { active },
  });

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("hook usePresence", () => {
  it("mounts immediately but only becomes visible a frame later, so enter can animate", () => {
    const { result, rerender } = renderPresence(false);

    expect(result.current).toEqual({ mounted: false, visible: false });

    rerender({ active: true });
    expect(result.current.mounted).toBe(true);
    expect(result.current.visible).toBe(false);

    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(result.current.visible).toBe(true);
  });

  it("hides immediately on exit but stays mounted for the duration, so exit can animate", () => {
    const { result, rerender } = renderPresence(true);

    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(result.current).toEqual({ mounted: true, visible: true });

    rerender({ active: false });
    expect(result.current.visible).toBe(false);
    expect(result.current.mounted).toBe(true);

    act(() => {
      vi.advanceTimersByTime(DURATION_MS);
    });
    expect(result.current.mounted).toBe(false);
  });

  it("cancels a pending unmount when reactivated mid-exit", () => {
    const { result, rerender } = renderPresence(true);

    act(() => {
      vi.advanceTimersByTime(50);
    });

    rerender({ active: false });
    act(() => {
      vi.advanceTimersByTime(DURATION_MS / 2);
    });

    rerender({ active: true });
    act(() => {
      vi.advanceTimersByTime(DURATION_MS);
    });
    expect(result.current).toEqual({ mounted: true, visible: true });
  });
});
