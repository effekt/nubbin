import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { toStringPuckField } from "./toStringPuckField";

test("a bounded string becomes the bounded custom control", () => {
  const field = toStringPuckField({ path: "f", kind: "string", optional: false, maxLength: 60 });
  expect(field.type).toBe("custom");
});

test("a link-hinted string becomes the link control even when the schema bounds it", () => {
  const field = toStringPuckField({
    path: "f",
    kind: "string",
    optional: false,
    control: "link",
    maxLength: 60,
  });
  if (field.type !== "custom") throw new Error("expected a custom field");
  const Render = field.render;
  render(
    <Render
      id="f"
      name="f"
      field={field}
      value="https://example.com/x"
      onChange={() => undefined}
    />,
  );
  expect(
    screen.getByRole("link", { name: "Open https://example.com/x in a new tab" }),
  ).toBeDefined();
  expect(screen.getByText("21/60")).toBeDefined();
});

test("an unbounded string stays the stock text field", () => {
  expect(toStringPuckField({ path: "f", kind: "string", optional: false })).toEqual({
    type: "text",
    label: "f",
  });
});
