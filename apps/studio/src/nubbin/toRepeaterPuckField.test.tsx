import { zodAdapter } from "@nubbin/core";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { z } from "zod";
import { toRepeaterPuckField } from "./toRepeaterPuckField";

const fields = zodAdapter.describe(
  z.object({ stats: z.array(z.object({ label: z.string() })).max(4) }),
);
const statsField = fields.find((field) => field.path === "stats");
if (statsField === undefined) throw new Error("the description lost the stats field");

test("builds a custom field labelled by the path whose render is the repeater", () => {
  const field = toRepeaterPuckField(statsField, fields);
  expect(field.type).toBe("custom");
  expect(field.label).toBe("stats");
  render(
    field.render({
      id: "stats",
      name: "stats",
      field,
      value: [{ label: "springs mapped" }],
      onChange: () => undefined,
    }),
  );
  expect(screen.getByText("stats (1 / 4)")).toBeDefined();
  expect(screen.getByRole("button", { name: "springs mapped" })).toBeDefined();
});
