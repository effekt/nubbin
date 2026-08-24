import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { IssuesPanel } from "./IssuesPanel";

test("each issue reads as one author line under the heading", () => {
  render(
    <IssuesPanel
      heading="Publishing was refused"
      issues={[
        { nodeId: "n1", blockName: "Hero", fieldLabel: "Headline", message: "maximum 80" },
        { message: "route is taken" },
      ]}
      onSelect={() => undefined}
    />,
  );
  expect(screen.getByRole("heading", { name: "Publishing was refused" })).toBeDefined();
  expect(screen.getByText("Hero — Headline: maximum 80")).toBeDefined();
  expect(screen.getByText("route is taken")).toBeDefined();
});

test("clicking an issue that names a node selects it", () => {
  const onSelect = vi.fn();
  render(
    <IssuesPanel
      heading="This draft has issues"
      issues={[{ nodeId: "n1", blockName: "Hero", fieldLabel: "Headline", message: "maximum 80" }]}
      onSelect={onSelect}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Hero — Headline: maximum 80" }));
  expect(onSelect).toHaveBeenCalledWith("n1");
});

test("an issue naming no node is not a button", () => {
  render(
    <IssuesPanel heading="h" issues={[{ message: "route is taken" }]} onSelect={() => undefined} />,
  );
  expect(screen.queryByRole("button")).toBeNull();
});
