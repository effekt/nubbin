import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { toReadOnlyPuckField } from "./toReadOnlyPuckField";

test("builds a custom field labelled by the path", () => {
  const field = toReadOnlyPuckField({ path: "items", kind: "array", optional: false });
  expect(field.type).toBe("custom");
  expect(field.label).toBe("items");
});

test("its render shows the value as read-only JSON", () => {
  const field = toReadOnlyPuckField({ path: "items", kind: "array", optional: false });
  const Render = field.render;
  render(
    <Render
      field={field}
      name="items"
      id="items"
      value={[{ title: "one" }]}
      onChange={() => undefined}
    />,
  );
  expect(screen.getByText("items")).toBeDefined();
  expect(screen.getByText(/read-only/)).toBeDefined();
  expect(screen.getByText(/"title"/)).toBeDefined();
});

test("its render hands Puck's field id through, so Go-to-it can address the region", () => {
  const field = toReadOnlyPuckField({ path: "items", kind: "array", optional: false });
  const Render = field.render;
  const { container } = render(
    <Render
      field={field}
      name="items"
      id="n7_custom_items"
      value={[]}
      onChange={() => undefined}
    />,
  );
  expect(container.querySelector("#n7_custom_items")).not.toBeNull();
});
