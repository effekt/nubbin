import { render, screen } from "@testing-library/react";
import { isValidElement } from "react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { toPuckRender } from "./toPuckRender";

function Stack(props: Record<string, unknown>) {
  return (
    <div>
      <p>{typeof props.label === "string" ? props.label : null}</p>
      {isValidElement(props.sections) ? props.sections : null}
    </div>
  );
}

function Prose(props: Record<string, unknown>) {
  const body = props.body;
  if (!Array.isArray(body)) {
    throw new Error("rich text must be an array of blocks");
  }
  return <p>{body.join(" ")}</p>;
}

beforeEach(() => {
  // React reports every caught render error to the console; catching is the point here.
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
});

test("renders the block with its slot components resolved to elements", () => {
  const renderBlock = toPuckRender("Stack", Stack, ["sections"]);
  const Slot = () => <p>slot child</p>;
  render(renderBlock({ label: "the stack", sections: Slot }));
  expect(screen.getByText("the stack")).toBeDefined();
  expect(screen.getByText("slot child")).toBeDefined();
});

test("a block throwing on its draft props degrades to the placeholder naming it", () => {
  const renderBlock = toPuckRender("Prose", Prose, []);
  render(renderBlock({ body: "a plain string where rich text belongs" }));
  expect(screen.getByText(/Prose can’t render/)).toBeDefined();
});

test("a broken child in a slot marks itself while the parent renders on", () => {
  const renderChild = toPuckRender("Prose", Prose, []);
  const renderParent = toPuckRender("Stack", Stack, ["sections"]);
  const Slot = () => renderChild({ body: "not an array" });
  render(renderParent({ label: "the stack survives", sections: Slot }));
  expect(screen.getByText("the stack survives")).toBeDefined();
  expect(screen.getByText(/Prose can’t render/)).toBeDefined();
});

test("fixed props render the real block again — recovery needs no reload", () => {
  const renderBlock = toPuckRender("Prose", Prose, []);
  const { rerender } = render(renderBlock({ body: "a plain string" }));
  expect(screen.getByText(/Prose can’t render/)).toBeDefined();
  rerender(renderBlock({ body: ["the", "corrected", "table"] }));
  expect(screen.getByText("the corrected table")).toBeDefined();
  expect(screen.queryByText(/Prose can’t render/)).toBeNull();
});
