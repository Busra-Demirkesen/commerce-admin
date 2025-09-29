import { jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeToggle } from "@/components/theme-toggle";

jest.mock("next-themes", () => ({
  useTheme: () => ({
    setTheme: jest.fn(),
  }),
}));

describe("ThemeToggle", () => {
  it("shows theme options after clicking the trigger", async () => {
    render(<ThemeToggle />);
    await userEvent.click(
      screen.getByRole("button", { name: /toggle theme/i })
    );

    expect(
      screen.getByRole("menuitem", { name: /light/i })
    ).toBeVisible();
    expect(
      screen.getByRole("menuitem", { name: /dark/i })
    ).toBeVisible();
    expect(
      screen.getByRole("menuitem", { name: /system/i })
    ).toBeVisible();
  });
});
