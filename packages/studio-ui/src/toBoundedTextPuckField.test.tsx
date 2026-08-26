import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { toBoundedTextPuckField } from "./toBoundedTextPuckField";

const field = { path: "headline", kind: "string" as const, optional: false, maxLength: 60 };

test("builds a custom field labelled by the schema path", () => {
  const puckField = toBoundedTextPuckField(field, 60);
  expect(puckField.type).toBe("custom");
  expect(puckField.label).toBe("headline");
});

test("its render is the bounded control, counter and all", () => {
  const puckField = toBoundedTextPuckField(field, 60);
  const Render = puckField.render;
  render(
    <Render
      id="headline"
      name="headline"
      field={puckField}
      value={"x".repeat(96)}
      onChange={() => undefined}
    />,
  );
  expect(screen.getByText("96/60")).toBeDefined();
  expect(screen.getByText("Keep it under 60 characters — it's 96 now.")).toBeDefined();
});
