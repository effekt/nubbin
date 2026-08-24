import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { PREVIEW_HIDE_DELAY_MS, PREVIEW_SHOW_DELAY_MS } from "./hoverPreview.constants";
import { useHoverPreview } from "./useHoverPreview";

const hero = { name: "Hero" };
const split = { name: "Split" };

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

const renderPreview = (target: { name: string } | undefined) =>
  renderHook(({ at }) => useHoverPreview(at), { initialProps: { at: target } });

test("the panel waits the show delay before first appearing", () => {
  const { result } = renderPreview(hero);
  expect(result.current.preview).toBeUndefined();
  act(() => vi.advanceTimersByTime(PREVIEW_SHOW_DELAY_MS));
  expect(result.current.preview).toEqual(hero);
});

test("travel across rows before the delay opens nothing for the rows passed", () => {
  const { result, rerender } = renderPreview(hero);
  act(() => vi.advanceTimersByTime(PREVIEW_SHOW_DELAY_MS - 1));
  rerender({ at: split });
  act(() => vi.advanceTimersByTime(PREVIEW_SHOW_DELAY_MS - 1));
  expect(result.current.preview).toBeUndefined();
  act(() => vi.advanceTimersByTime(1));
  expect(result.current.preview).toEqual(split);
});

test("an open panel swaps content immediately when the pointer reaches another row", () => {
  const { result, rerender } = renderPreview(hero);
  act(() => vi.advanceTimersByTime(PREVIEW_SHOW_DELAY_MS));
  rerender({ at: split });
  expect(result.current.preview).toEqual(split);
});

test("leaving closes after the grace, and row-to-row travel survives it", () => {
  const { result, rerender } = renderPreview(hero);
  act(() => vi.advanceTimersByTime(PREVIEW_SHOW_DELAY_MS));
  rerender({ at: undefined });
  expect(result.current.preview).toEqual(hero);
  rerender({ at: split });
  act(() => vi.advanceTimersByTime(PREVIEW_HIDE_DELAY_MS));
  expect(result.current.preview).toEqual(split);
  rerender({ at: undefined });
  act(() => vi.advanceTimersByTime(PREVIEW_HIDE_DELAY_MS));
  expect(result.current.preview).toBeUndefined();
});

test("dismiss closes the panel and the still-hovered row does not reopen it", () => {
  const { result, rerender } = renderPreview(hero);
  act(() => vi.advanceTimersByTime(PREVIEW_SHOW_DELAY_MS));
  act(() => result.current.dismiss());
  expect(result.current.preview).toBeUndefined();
  rerender({ at: hero });
  act(() => vi.advanceTimersByTime(PREVIEW_SHOW_DELAY_MS));
  expect(result.current.preview).toBeUndefined();
  rerender({ at: split });
  act(() => vi.advanceTimersByTime(PREVIEW_SHOW_DELAY_MS));
  expect(result.current.preview).toEqual(split);
});
