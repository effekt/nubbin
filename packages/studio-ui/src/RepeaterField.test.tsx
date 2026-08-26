import { readFileSync } from "node:fs";
import { zodAdapter } from "@nubbin/core";
import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { expect, test } from "vitest";
import { z } from "zod";
import { RepeaterField } from "./RepeaterField";
import { SubFieldControl } from "./SubFieldControl";

const schema = z.object({
  stats: z
    .array(z.object({ value: z.string().max(12), label: z.string().max(40) }))
    .min(2)
    .max(4),
});
const fields = zodAdapter.describe(schema);
const found = fields.find((field) => field.path === "stats");
if (found === undefined) throw new Error("the description lost the stats field");
const statsField = found;

const twoStats = [
  { value: "6", label: "springs mapped" },
  { value: "3 mi", label: "of shoreline" },
];

function Harness({ initial }: { initial: unknown[] }) {
  const [value, setValue] = useState<unknown>(initial);
  return (
    <RepeaterField
      id="stats"
      label="stats"
      field={statsField}
      fields={fields}
      value={value}
      readOnly={false}
      onChange={setValue}
      renderField={SubFieldControl}
    />
  );
}

test("rows are labelled by their first string field's value, never an index", () => {
  render(<Harness initial={twoStats} />);
  expect(screen.getByRole("button", { name: /6/ })).toBeDefined();
  expect(screen.getByRole("button", { name: /3 mi/ })).toBeDefined();
  expect(screen.queryByText(/Item/)).toBeNull();
});

test("a row with nothing to say for itself shows the warning glyph and the word untitled", () => {
  render(<Harness initial={[{ value: "", label: "x" }, twoStats[1]]} />);
  expect(screen.getByText("(untitled)")).toBeDefined();
});

test("add is disabled at the array's max, with the reason in its title", () => {
  render(<Harness initial={[...twoStats, ...twoStats]} />);
  const add = screen.getByRole("button", { name: "+ Add" });
  expect(add.hasAttribute("disabled")).toBe(true);
  expect(add.getAttribute("title")).toBe("This list holds at most 4.");
});

test("remove is disabled at the array's min, with the reason in its title", () => {
  render(<Harness initial={twoStats} />);
  const removes = screen.getAllByRole("button", { name: "Remove row" });
  expect(removes).toHaveLength(2);
  for (const remove of removes) {
    expect(remove.hasAttribute("disabled")).toBe(true);
    expect(remove.getAttribute("title")).toBe("This list needs at least 2.");
  }
});

test("add appends a blank row and the count follows", () => {
  render(<Harness initial={twoStats} />);
  fireEvent.click(screen.getByRole("button", { name: "+ Add" }));
  expect(screen.getByText("stats (3 / 4)")).toBeDefined();
  expect(screen.getByText("(untitled)")).toBeDefined();
});

test("the move buttons reorder rows, and the ends disable their own direction", () => {
  render(<Harness initial={twoStats} />);
  const ups = screen.getAllByRole("button", { name: "Move row up" });
  expect(ups[0]?.hasAttribute("disabled")).toBe(true);
  fireEvent.click(screen.getAllByRole("button", { name: "Move row down" })[0] as Element);
  const labels = screen.getAllByRole("button", { name: /mi|6/ }).map((b) => b.textContent);
  expect(labels[0]).toContain("3 mi");
  expect(labels[1]).toContain("6");
});

test("a reordered row keeps its identity — the open disclosure and its DOM node ride along", () => {
  render(<Harness initial={twoStats} />);
  const disclosure = screen.getByRole("button", { name: /6/ });
  fireEvent.click(disclosure);
  expect(disclosure.getAttribute("aria-expanded")).toBe("true");
  const input = screen.getByDisplayValue("springs mapped");
  fireEvent.click(screen.getAllByRole("button", { name: "Move row down" })[0] as Element);
  const after = screen.getByRole("button", { name: /6/ });
  expect(after).toBe(disclosure);
  expect(after.getAttribute("aria-expanded")).toBe("true");
  expect(screen.getByDisplayValue("springs mapped")).toBe(input);
});

test("a bounded string inside a row keeps its counter and permissive over-limit line", () => {
  render(<Harness initial={twoStats} />);
  fireEvent.click(screen.getByRole("button", { name: /6/ }));
  const value = screen.getByDisplayValue("6");
  fireEvent.change(value, { target: { value: "a value far past twelve" } });
  expect(screen.getByText("23/12")).toBeDefined();
  expect(screen.getByText("Keep it under 12 characters — it's 23 now.")).toBeDefined();
  expect(screen.getByDisplayValue("a value far past twelve")).toBeDefined();
});

test("an undescribed row shape renders nothing rather than guessing", () => {
  const { container } = render(
    <RepeaterField
      id="x"
      label="x"
      field={{ path: "x", kind: "array", optional: false }}
      fields={[]}
      value={[]}
      readOnly={false}
      onChange={() => undefined}
      renderField={SubFieldControl}
    />,
  );
  expect(container.innerHTML).toBe("");
});

test("the repeater container Go-to-it lands on carries an explicit :focus ring", () => {
  const css = readFileSync("src/repeaterField.css", "utf8");
  const rule = css.match(/^\.nb-repeater:focus,\n\.nb-fieldset:focus \{[^}]*\}/m);
  expect(rule?.[0]).toContain("outline: 2px solid var(--nb-teal)");
});
