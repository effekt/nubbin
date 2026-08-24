import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { UpdateFeed } from "./UpdateFeed";
import { updateFeedSchema } from "./UpdateFeed.schema";
import { updateFeedDefaults } from "./updateFeedDefaults";

describe("UpdateFeed", () => {
  test("the schema accepts the defaults and rejects an entry missing its time", () => {
    expect(updateFeedSchema.safeParse(updateFeedDefaults).success).toBe(true);
    const rejected = updateFeedSchema.safeParse({
      heading: "Recent changes",
      entries: [{ text: "Lead dispatch replaced" }],
    });
    expect(rejected.success).toBe(false);
  });

  test("renders entries in the order given, each time beside its text", () => {
    render(<UpdateFeed {...updateFeedDefaults} />);

    const rows = screen.getAllByRole("listitem").map((row) => row.textContent);
    expect(rows).toEqual(updateFeedDefaults.entries.map((entry) => `${entry.at}${entry.text}`));
  });

  test("renders the heading and a quiet line when nothing has changed", () => {
    render(<UpdateFeed heading="Recent changes" entries={[]} />);

    expect(screen.getByRole("heading", { name: "Recent changes" })).toBeDefined();
    expect(screen.queryByRole("list")).toBeNull();
    expect(screen.getByText("Nothing has changed since the last edition.")).toBeDefined();
  });
});
