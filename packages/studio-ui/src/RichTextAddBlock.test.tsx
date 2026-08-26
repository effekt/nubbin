import { RICH_TEXT_BLOCK_KINDS } from "@nubbin/core";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { RichTextAddBlock } from "./RichTextAddBlock";

test("one add button per kind in core's closed set, each naming its kind", () => {
  const onAdd = vi.fn();
  render(<RichTextAddBlock readOnly={false} onAdd={onAdd} />);
  expect(screen.getAllByRole("button")).toHaveLength(RICH_TEXT_BLOCK_KINDS.length);
  fireEvent.click(screen.getByRole("button", { name: "Add paragraph" }));
  fireEvent.click(screen.getByRole("button", { name: "Add list item" }));
  expect(onAdd.mock.calls).toEqual([["paragraph"], ["listItem"]]);
});

test("read-only disables every add", () => {
  render(<RichTextAddBlock readOnly={true} onAdd={() => 0} />);
  for (const button of screen.getAllByRole("button")) {
    expect(button).toHaveProperty("disabled", true);
  }
});
