import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { IssueRow } from "./IssueRow";

const issue = {
  nodeId: "hero",
  blockName: "Hero",
  fieldLabel: "Headline",
  message: "Over the 60-character limit (it's 96 now)",
};

test("names the place and the message, with the way there as a real button", () => {
  const onGoTo = vi.fn();
  render(
    <ul>
      <IssueRow issue={issue} onGoTo={onGoTo} />
    </ul>,
  );
  expect(screen.getByText("Hero — Headline:")).toBeDefined();
  expect(screen.getByText(/Over the 60-character limit/)).toBeDefined();
  fireEvent.click(screen.getByRole("button", { name: "Go to it →" }));
  expect(onGoTo).toHaveBeenCalledWith(issue);
});

test("an issue naming no node keeps its message and drops the button", () => {
  render(
    <ul>
      <IssueRow issue={{ message: "route already live" }} onGoTo={() => undefined} />
    </ul>,
  );
  expect(screen.getByText("route already live")).toBeDefined();
  expect(screen.queryByRole("button")).toBeNull();
});
