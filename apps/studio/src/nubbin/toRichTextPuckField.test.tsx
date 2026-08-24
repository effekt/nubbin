import type { FieldNode } from "@nubbin/core";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { toRichTextPuckField } from "./toRichTextPuckField";

const field: FieldNode = { path: "body", kind: "array", optional: false };

test("builds a custom field whose render is the rich-text control", () => {
  const built = toRichTextPuckField(field);
  expect(built.type).toBe("custom");
  expect(built.label).toBe("body");
  const Render = built.render;
  render(
    <Render
      id="body"
      name="body"
      field={built}
      value={[{ kind: "paragraph", spans: [{ text: "hello" }] }]}
      onChange={() => 0}
    />,
  );
  expect(screen.getByRole("toolbar", { name: "Text style" })).toBeDefined();
  expect(screen.getByDisplayValue("hello")).toBeDefined();
});
