import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ToastProvider, useToast } from ".";

import type { ToastProps } from "../Toast";

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

describe("<ToastProvider />", () => {
  it("lets any code trigger a transient message via useToast", async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<AppWithToasts />);

    const button = getByRole("button", { name: "Activate" });
    await user.click(button);

    expect(getByRole("alert")).toBeInTheDocument();
  });
  it("throws when useToast is used outside a ToastProvider", () => {
    let error;

    try {
      render(<Consumer />);
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(Error);
  });
});
