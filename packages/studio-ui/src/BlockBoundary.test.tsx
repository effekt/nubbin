import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { BlockBoundary } from "./BlockBoundary";

function Throwing(): never {
  throw new Error("a plain string where rich text belongs");
}

beforeEach(() => {
  // React reports every caught render error to the console; the catching is the behaviour
  // under test, so the report is noise here — restored after each test.
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
});

test("a throwing child degrades to the placeholder naming the block", () => {
  render(
    <BlockBoundary blockName="Prose">
      <Throwing />
    </BlockBoundary>,
  );
  expect(screen.getByText(/Prose can’t render/)).toBeDefined();
});

test("a sibling boundary is untouched by the one that caught", () => {
  render(
    <>
      <BlockBoundary blockName="Prose">
        <Throwing />
      </BlockBoundary>
      <BlockBoundary blockName="Hero">
        <p>the hero renders on</p>
      </BlockBoundary>
    </>,
  );
  expect(screen.getByText(/Prose can’t render/)).toBeDefined();
  expect(screen.getByText("the hero renders on")).toBeDefined();
});

test("a broken child inside a parent's slot marks itself without breaking the parent", () => {
  render(
    <BlockBoundary blockName="Split">
      <section>
        <p>the split's own chrome</p>
        <BlockBoundary blockName="Prose">
          <Throwing />
        </BlockBoundary>
      </section>
    </BlockBoundary>,
  );
  expect(screen.getByText("the split's own chrome")).toBeDefined();
  expect(screen.getByText(/Prose can’t render/)).toBeDefined();
});

test("a new key remounts the boundary, so fixed props render the real block again", () => {
  const { rerender } = render(
    <BlockBoundary key="broken" blockName="Prose">
      <Throwing />
    </BlockBoundary>,
  );
  expect(screen.getByText(/Prose can’t render/)).toBeDefined();
  rerender(
    <BlockBoundary key="fixed" blockName="Prose">
      <p>the real block, back</p>
    </BlockBoundary>,
  );
  expect(screen.getByText("the real block, back")).toBeDefined();
  expect(screen.queryByText(/Prose can’t render/)).toBeNull();
});
