import { act } from "react";

import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Bot } from "lucide-react";

import { Toast } from ".";

import { ThemeContext } from "@Services";

import { ToastProvider, useToast } from "./provider";

import type { ToastProps } from "./Toast";

const Consumer = (props: ToastProps) => {
  const { triggerToast } = useToast();

  const handleSpawnTestToast = () => {
    triggerToast({ ...props });
  };

  return (
    <>
      <div>children</div>
      <button onClick={handleSpawnTestToast}>Activate</button>
    </>
  );
};

const AppWithToasts = (props: ToastProps) => (
  <ToastProvider>
    <Consumer {...props} />
  </ToastProvider>
);

describe("<Toast />", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders its children as the toast content", async () => {
    const user = userEvent.setup();
    const { getByRole } = render(
      <AppWithToasts>
        <strong>Saved!</strong>
      </AppWithToasts>,
    );

    await user.click(getByRole("button", { name: "Activate" }));

    expect(getByRole("alert")).toContainHTML("<strong>Saved!</strong>");
  });

  it("appears overlaid without shifting page layout", async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<AppWithToasts />);

    await user.click(getByRole("button", { name: "Activate" }));

    expect(getByRole("alert").parentElement).toHaveClass("fixed");
  });

  it("stacks multiple toasts without overlap", async () => {
    const user = userEvent.setup();
    const { getByRole, getAllByRole } = render(<AppWithToasts />);

    await user.click(getByRole("button", { name: "Activate" }));
    await user.click(getByRole("button", { name: "Activate" }));

    const [first, second] = getAllByRole("alert");

    expect(first).not.toHaveClass("fixed");
    expect(second).not.toHaveClass("fixed");
    expect(first.parentElement).toBe(second.parentElement);
    expect(first.parentElement).toHaveClass("fixed flex flex-col");
  });

  it("auto-dismisses success and info toasts", () => {
    vi.useFakeTimers();

    for (const variant of ["success", "info"] as const) {
      const { getByRole, queryByRole, unmount } = render(
        <AppWithToasts variant={variant} />,
      );

      fireEvent.click(getByRole("button", { name: "Activate" }));
      expect(getByRole("alert")).toBeInTheDocument();

      act(() => {
        vi.runAllTimers();
      });
      expect(queryByRole("alert")).not.toBeInTheDocument();
      unmount();
    }
  });

  it("persists the error variant until explicitly dismissed", () => {
    vi.useFakeTimers();

    const { getByRole } = render(<AppWithToasts variant="error" />);

    fireEvent.click(getByRole("button", { name: "Activate" }));

    act(() => {
      vi.runAllTimers();
    });
    expect(getByRole("alert")).toBeInTheDocument();
  });

  it("shows a visible dismiss control on the error variant", () => {
    const { getByRole } = render(<Toast variant="error" />);
    const button = getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("removes the error toast when its dismiss control is clicked", () => {
    vi.useFakeTimers();

    const { getByRole, queryByRole } = render(
      <AppWithToasts variant="error" />,
    );

    fireEvent.click(getByRole("button", { name: "Activate" }));
    fireEvent.click(getByRole("button", { name: "Dismiss" }));

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(queryByRole("alert")).not.toBeInTheDocument();
  });

  it("animates in from its off-screen origin edge and back out on dismiss", () => {
    vi.useFakeTimers();

    const { getByRole, queryByRole } = render(
      <AppWithToasts variant="success" />,
    );

    fireEvent.click(getByRole("button", { name: "Activate" }));
    expect(getByRole("alert")).toHaveClass("translate-y-full");

    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(getByRole("alert")).not.toHaveClass("translate-y-full");

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(getByRole("alert")).toHaveClass("translate-y-full");

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(queryByRole("alert")).not.toBeInTheDocument();
  });

  it("prefers animating from the side edge when not horizontally centered", () => {
    vi.useFakeTimers();

    for (const [horizontal, expectedClass] of [
      ["left", "-translate-x-full"],
      ["right", "translate-x-full"],
    ] as const) {
      const { getByRole, unmount } = render(
        <AppWithToasts vertical="top" horizontal={horizontal} />,
      );

      fireEvent.click(getByRole("button", { name: "Activate" }));
      expect(getByRole("alert")).toHaveClass(expectedClass);
      expect(getByRole("alert")).not.toHaveClass("-translate-y-full");
      unmount();
    }
  });

  it("is configurable to appear in the top, middle or bottom of the viewport", async () => {
    const user = userEvent.setup();

    for (const [vertical, expectedClass] of [
      ["top", "top-0"],
      ["middle", "top-1/2 -translate-y-1/2"],
      ["bottom", "bottom-0"],
    ] as const) {
      const { getByRole, unmount } = render(
        <AppWithToasts vertical={vertical} />,
      );

      await user.click(getByRole("button", { name: "Activate" }));

      expect(getByRole("alert").parentElement).toHaveClass(expectedClass);
      unmount();
    }
  });

  it("is configurable to appear in the left, center, or right of the viewport", async () => {
    const user = userEvent.setup();

    for (const [horizontal, expectedClass] of [
      ["left", "left-0"],
      ["center", "left-1/2 -translate-x-1/2"],
      ["right", "right-0"],
    ] as const) {
      const { getByRole, unmount } = render(
        <AppWithToasts horizontal={horizontal} />,
      );

      await user.click(getByRole("button", { name: "Activate" }));

      expect(getByRole("alert").parentElement).toHaveClass(expectedClass);
      unmount();
    }
  });

  it("prefers the current theme's status icons over the built-in defaults", async () => {
    const user = userEvent.setup();
    const { getByRole } = render(
      <ThemeContext.Provider
        value={{
          theme: {
            name: "Test",
            value: "test",
            statusIcons: { success: <Bot data-testid="theme-icon" /> },
          },
          setTheme: () => {},
        }}
      >
        <AppWithToasts variant="success" />
      </ThemeContext.Provider>,
    );

    await user.click(getByRole("button", { name: "Activate" }));

    expect(
      getByRole("alert").querySelector("[data-testid='theme-icon']"),
    ).toBeInTheDocument();
  });

  it("shows an icon if provided, or a default", async () => {
    const user = userEvent.setup();

    const { getByRole, unmount } = render(
      <AppWithToasts icon={<Bot data-testid="custom-icon" />} />,
    );
    await user.click(getByRole("button", { name: "Activate" }));
    expect(
      getByRole("alert").querySelector("[data-testid='custom-icon']"),
    ).toBeInTheDocument();
    unmount();

    const { getByRole: getByRoleDefault } = render(
      <AppWithToasts variant="success" />,
    );
    await user.click(getByRoleDefault("button", { name: "Activate" }));
    expect(getByRoleDefault("alert").querySelector("svg")).toBeInTheDocument();
  });

  it("does not render anything when not mounted", () => {
    const { queryByRole } = render(<Toast active={false} />);
    expect(queryByRole("alert")).not.toBeInTheDocument();
  });
});
