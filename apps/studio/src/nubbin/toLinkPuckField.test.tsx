import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { toLinkPuckField } from "./toLinkPuckField";

const field = {
  path: "cta.href",
  kind: "string" as const,
  optional: false,
  control: "link",
};

test("builds a custom field labelled by the schema path", () => {
  const puckField = toLinkPuckField(field);
  expect(puckField.type).toBe("custom");
  expect(puckField.label).toBe("cta.href");
});

test("its render is the link control — note for garbage, Open for an absolute URL", () => {
  const puckField = toLinkPuckField(field);
  const Render = puckField.render;
  const { rerender } = render(
    <Render
      id="cta.href"
      name="cta.href"
      field={puckField}
      value="not a link"
      onChange={() => undefined}
    />,
  );
  expect(screen.getByText(/Not a link yet/)).toBeDefined();
  rerender(
    <Render
      id="cta.href"
      name="cta.href"
      field={puckField}
      value="https://example.com/x"
      onChange={() => undefined}
    />,
  );
  expect(
    screen.getByRole("link", { name: "Open https://example.com/x in a new tab" }),
  ).toBeDefined();
});
