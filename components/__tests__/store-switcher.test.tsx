import "@testing-library/jest-dom";
import React from "react";
import type { Store } from "@prisma/client";
import { beforeAll, beforeEach, describe, it, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const pushMock = jest.fn();
const useParamsMock = jest.fn();
const onOpenMock = jest.fn();

jest.mock("next/navigation", () => ({
  __esModule: true,
  useParams: () => useParamsMock(),
  useRouter: () => ({
    push: pushMock,
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: jest.fn(),
}));

jest.mock("@/hooks/use-store-modal", () => ({
  useStoreModal: () => ({
    isOpen: false,
    onOpen: onOpenMock,
    onClose: jest.fn(),
  }),
}));

jest.mock("@/components/ui/popover", () => ({
  Popover: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PopoverTrigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  PopoverContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="popover-content">{children}</div>
  ),
}));

jest.mock("@/components/ui/command", () => ({
  Command: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CommandList: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CommandEmpty: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CommandGroup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CommandSeparator: () => <hr />,
  CommandInput: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input aria-label="search" {...props} />
  ),
  CommandItem: ({
    children,
    onSelect,
  }: {
    children: React.ReactNode;
    onSelect?: () => void;
  }) => (
    <button type="button" onClick={() => onSelect?.()}>
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
}));

let StoreSwitcher: (typeof import("@/components/store-switcher"))["default"];

const storesFixture = [
  { id: "s_1", name: "Store Alpha" },
  { id: "s_2", name: "Store Beta" },
] satisfies Array<{ id: string; name: string }>;

const renderComponent = () =>
  render(<StoreSwitcher items={storesFixture as unknown as Store[]} />);

beforeAll(async () => {
  ({ default: StoreSwitcher } = await import("@/components/store-switcher"));
});

describe("StoreSwitcher", () => {
  beforeEach(() => {
    pushMock.mockReset();
    onOpenMock.mockReset();
    useParamsMock.mockReset();
  });

  it("displays the current store based on route params", () => {
    useParamsMock.mockReturnValue({ storeId: "s_2" });

    renderComponent();

    const trigger = screen.getByRole("combobox", { name: /select a store/i });
    expect(trigger).toHaveTextContent("Store Beta");
  });

  it("navigates to the selected store", async () => {
    useParamsMock.mockReturnValue({ storeId: "s_1" });

    renderComponent();

    await userEvent.click(
      screen.getByRole("button", { name: /^Store Beta$/i })
    );

    expect(pushMock).toHaveBeenCalledWith("/s_2");
  });

  it("opens the create store modal", async () => {
    useParamsMock.mockReturnValue({ storeId: "s_1" });

    renderComponent();

    await userEvent.click(screen.getByRole("button", { name: /create store/i }));

    expect(onOpenMock).toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();
  });
});
