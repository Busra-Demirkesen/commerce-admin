import { act } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "@jest/globals";
import { useStoreModal } from "@/hooks/use-store-modal";

describe("useStoreModal", () => {
  beforeEach(() => {
    act(() => {
      useStoreModal.setState({ isOpen: false });
    });
  });

  it("is closed by default", () => {
    expect(useStoreModal.getState().isOpen).toBe(false);
  });

  it("opens the modal", () => {
    act(() => {
      useStoreModal.getState().onOpen();
    });

    expect(useStoreModal.getState().isOpen).toBe(true);
  });

  it("closes the modal after opening", () => {
    act(() => {
      useStoreModal.getState().onOpen();
      useStoreModal.getState().onClose();
    });

    expect(useStoreModal.getState().isOpen).toBe(false);
  });
});
