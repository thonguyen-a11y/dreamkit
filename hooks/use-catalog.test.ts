import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PRODUCTS } from "@/lib/products";
import { useCatalog } from "./use-catalog";

describe("useCatalog", () => {
  it("paginates with the default page size", () => {
    const { result } = renderHook(() => useCatalog(PRODUCTS));

    expect(result.current.totalCount).toBe(PRODUCTS.length);
    expect(result.current.pageSize).toBe(12);
    expect(result.current.totalPages).toBe(2);
    expect(result.current.pageItems).toHaveLength(12);
    expect(result.current.rangeStart).toBe(1);
    expect(result.current.rangeEnd).toBe(12);
  });

  it("navigates to a later page and reports the correct range", () => {
    const { result } = renderHook(() => useCatalog(PRODUCTS));

    act(() => result.current.setPage(2));

    expect(result.current.page).toBe(2);
    expect(result.current.pageItems).toHaveLength(PRODUCTS.length - 12);
    expect(result.current.rangeStart).toBe(13);
    expect(result.current.rangeEnd).toBe(PRODUCTS.length);
  });

  it("recomputes pages and resets to page 1 when the limit changes", () => {
    const { result } = renderHook(() => useCatalog(PRODUCTS));

    act(() => result.current.setPage(2));
    act(() => result.current.setPageSize(24));

    expect(result.current.pageSize).toBe(24);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.pageItems).toHaveLength(PRODUCTS.length);
    expect(result.current.page).toBe(1);

    act(() => result.current.setPageSize(6));
    expect(result.current.totalPages).toBe(Math.ceil(PRODUCTS.length / 6));
  });

  it("resets to page 1 when a filter changes", () => {
    const { result } = renderHook(() => useCatalog(PRODUCTS));

    act(() => result.current.setPageSize(6));
    act(() => result.current.setPage(3));
    expect(result.current.page).toBe(3);

    act(() => result.current.toggleColor("red"));
    expect(result.current.page).toBe(1);
  });
});
