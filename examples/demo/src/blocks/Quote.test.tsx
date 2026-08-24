import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Quote } from "./Quote";
import { quoteDefaults } from "./quoteDefaults";

describe("Quote", () => {
  test("renders the words inside a blockquote, attributed in a figcaption", () => {
    const { container } = render(<Quote {...quoteDefaults} />);

    expect(container.querySelector("blockquote")?.textContent).toBe(quoteDefaults.text);
    expect(container.querySelector("figcaption")?.textContent).toContain(
      quoteDefaults.attribution.name,
    );
  });

  test("the quote mark is a styled glyph assistive tech never reads", () => {
    const { container } = render(<Quote {...quoteDefaults} />);

    const mark = container.querySelector('[aria-hidden="true"]');
    expect(mark?.textContent).toBe("“");
    expect(container.querySelector("img")).toBeNull();
  });

  test("a missing role leaves the name standing alone", () => {
    render(<Quote {...quoteDefaults} attribution={{ name: "A reader in Seasalter" }} />);

    expect(screen.getByText("A reader in Seasalter")).toBeDefined();
    expect(screen.queryByText(quoteDefaults.attribution.role ?? "")).toBeNull();
  });
});
