import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "@jest/globals";
import { useOrigin } from "@/hooks/use-origin";

describe("useOrigin", () => {
  it("eventually returns the window origin", async () => {
    const { result } = renderHook(() => useOrigin());

    await waitFor(() => {
      expect(result.current).toBe(window.location.origin);
    });
  });
});
