import { defineBlock } from "@nubbin/core";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { expect, test } from "vitest";
import { z } from "zod";
import { toPuckComponentConfig } from "./toPuckComponentConfig";

const schema = z.object({
  headline: z.string(),
  count: z.number(),
  cta: z.object({ label: z.string() }),
});

function Banner({ headline, items }: { headline?: string; items?: ReactNode }) {
  return (
    <div>
      <p>{headline}</p>
      {items}
    </div>
  );
}

const block = defineBlock({
  name: "Banner",
  schema,
  component: Banner,
  version: 1,
  slots: { items: { allow: ["Card"], min: 1, max: 4 } },
});

test("scalar fields come from the schema, nested paths from their read-only parent", () => {
  const config = toPuckComponentConfig({ schema, defaults: { headline: "hi" } }, block);
  expect(config.fields?.headline).toEqual({ type: "text", label: "headline" });
  expect(config.fields?.count).toEqual({ type: "number", label: "count" });
  expect(config.fields?.cta?.type).toBe("custom");
  expect(Object.keys(config.fields ?? {})).not.toContain("cta.label");
});

test("each declared slot is a slot field, and its default starts empty", () => {
  const config = toPuckComponentConfig({ schema }, block);
  expect(config.fields?.items).toEqual({ type: "slot", allow: ["Card"] });
  expect(config.defaultProps?.items).toEqual([]);
});

test("defaults carry over as defaultProps", () => {
  const config = toPuckComponentConfig({ schema, defaults: { headline: "hi" } }, block);
  expect(config.defaultProps?.headline).toBe("hi");
});

test("render is the registry's own component, with Puck's context stripped before it", () => {
  const config = toPuckComponentConfig({ schema }, block);
  const element = config.render({
    headline: "rendered by the block",
    id: "b1",
    puck: { renderDropZone: () => null, metadata: {}, isEditing: true, dragRef: null },
  });
  render(element);
  expect(screen.getByText("rendered by the block")).toBeDefined();
});
