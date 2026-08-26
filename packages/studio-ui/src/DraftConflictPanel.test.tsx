import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { DraftConflictPanel } from "./DraftConflictPanel";

afterEach(cleanup);

test("shows both sides and reports the author's resolution", () => {
  const resolve = vi.fn();
  render(
    <DraftConflictPanel
      conflicts={[
        {
          path: ["elements", "hero", "props", "title"],
          base: { present: true, value: "Before" },
          local: { present: true, value: "Mine" },
          remote: { present: true, value: "Theirs" },
        },
      ]}
      onResolve={resolve}
    />,
  );
  expect(screen.getByText('"Mine"')).toBeDefined();
  expect(screen.getByText('"Theirs"')).toBeDefined();
  fireEvent.click(screen.getByRole("button", { name: "Use theirs" }));
  expect(resolve).toHaveBeenCalledWith(0, "remote");
});
