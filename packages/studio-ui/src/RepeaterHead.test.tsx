import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { RepeaterHead } from "./RepeaterHead";

test("names the list with its count against the bound", () => {
  render(
    <RepeaterHead label="stats" count={3} maxItems={4} readOnly={false} onAdd={() => undefined} />,
  );
  expect(screen.getByText("stats (3 / 4)")).toBeDefined();
});

test("an unbounded list counts without inventing a bound", () => {
  render(<RepeaterHead label="rows" count={2} readOnly={false} onAdd={() => undefined} />);
  expect(screen.getByText("rows (2)")).toBeDefined();
});

test("add is enabled under the bound and disabled at it, with the reason in its title", () => {
  const onAdd = vi.fn();
  const { rerender } = render(
    <RepeaterHead label="stats" count={3} maxItems={4} readOnly={false} onAdd={onAdd} />,
  );
  const add = screen.getByRole("button", { name: "+ Add" });
  fireEvent.click(add);
  expect(onAdd).toHaveBeenCalledOnce();
  rerender(<RepeaterHead label="stats" count={4} maxItems={4} readOnly={false} onAdd={onAdd} />);
  expect(add.hasAttribute("disabled")).toBe(true);
  expect(add.getAttribute("title")).toBe("This list holds at most 4.");
});
