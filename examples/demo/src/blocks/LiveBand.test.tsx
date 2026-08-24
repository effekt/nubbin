import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { LiveBand } from "./LiveBand";
import { liveBandSchema } from "./LiveBand.schema";
import { liveBandDefaults } from "./liveBandDefaults";

describe("LiveBand", () => {
  test("the schema accepts the defaults and rejects an item missing its time", () => {
    expect(liveBandSchema.safeParse(liveBandDefaults).success).toBe(true);
    const rejected = liveBandSchema.safeParse({
      label: "On now",
      items: [{ text: "Spring tide peaking at the harbour wall" }],
    });
    expect(rejected.success).toBe(false);
  });

  test("renders the label and each item's time beside its text", () => {
    render(<LiveBand {...liveBandDefaults} />);

    expect(screen.getByRole("heading", { name: "On now" })).toBeDefined();
    expect(screen.getAllByRole("listitem")).toHaveLength(liveBandDefaults.items.length);
    for (const item of liveBandDefaults.items) {
      expect(screen.getByText(item.at).closest("li")?.textContent).toContain(item.text);
    }
  });

  test("renders a quiet line, never an empty list, when nothing is on", () => {
    render(<LiveBand label="On now" items={[]} />);

    expect(screen.queryByRole("list")).toBeNull();
    expect(screen.getByText("Quiet on the water this hour.")).toBeDefined();
  });
});
