import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { BackdropProvider } from "./Backdrop.Provider";
import { useBackdrop } from "./useBackdrop";

const Consumer = () => {
  const { active, setActive } = useBackdrop();
  return (
    <>
      <p>{active ? "active" : "inactive"}</p>
      <button onClick={() => setActive(true)}>Activate</button>
      <button onClick={() => setActive(false)}>Dismiss</button>
    </>
  );
};

describe("<BackdropProvider />", () => {
  it("manages backdrop activation/dismissal via context", async () => {
    const user = userEvent.setup();
    const { getByText } = render(
      <BackdropProvider>
        <Consumer />
      </BackdropProvider>,
    );

    expect(getByText("inactive")).toBeInTheDocument();

    await user.click(getByText("Activate"));
    expect(getByText("active")).toBeInTheDocument();

    await user.click(getByText("Dismiss"));
    expect(getByText("inactive")).toBeInTheDocument();
  });

  it("throws an error when used outside of BackdropProvider", () => {
    let error;

    try {
      render(<Consumer />);
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(Error);
  });
});
