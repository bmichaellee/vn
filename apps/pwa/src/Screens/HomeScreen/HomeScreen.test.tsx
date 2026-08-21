import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";

import { HomeScreen } from "./HomeScreen";

import { fixture_session } from "@Services";

vi.mock("@Services", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@Services")>();

  return {
    ...actual,
    useAuth: () => ({ session: actual.fixture_session }),
  };
});

describe("<HomeScreen />", () => {
  it("displays a centered 'Welcome, <handle>' placeholder for the logged-in user", () => {
    const { getByText } = render(<HomeScreen />);
    const element = getByText(`Welcome, ${fixture_session.user.handle}`);
    expect(element).toBeInTheDocument();
  });
});
