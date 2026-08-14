import { afterEach, describe, expect, it, vi } from "vitest";
import { act, render } from "@testing-library/react";

import { App } from "./App";

const { getHealth } = vi.hoisted(() => {
  return {
    getHealth: vi.fn().mockResolvedValue({
      database: "ok",
      version: "1.0.0",
    }),
  };
});

vi.mock("@Services", async importOriginal => {
  const actual = await importOriginal<typeof import("@Services")>();
  return {
    ...actual,
    AppService: {
      getVersion: vi.fn().mockReturnValue("1.0.0"),
      getHealth,
    },
  };
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("<App />", () => {
  it("displays the version number", async () => {
    const { getByText } = await act(async () => render(<App />));
    expect(getByText("1.0.0")).toBeInTheDocument();
  });

  it("displays the database status", async () => {
    const { container } = await act(async () => render(<App />));
    const healthResponse = container.querySelector("code");
    expect(healthResponse?.textContent).toContain(`"database":"ok"`);
  });

  it("displays an error message when the health check fails", async () => {
    getHealth.mockRejectedValueOnce(new Error("Health check failed"));
    const { getByText } = await act(async () => render(<App />));
    expect(getByText("Error: Health check failed")).toBeInTheDocument();
  });
});
