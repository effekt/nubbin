import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { InspectorDocsLinks } from "./InspectorDocsLinks";

const docs = {
  figma: "https://example.com/figma/hero",
  storybook: "https://example.com/storybook/hero",
};

test("renders one capitalized link per entry, opening in a new tab", () => {
  render(<InspectorDocsLinks docs={docs} />);
  const figma = screen.getByRole("link", { name: "Open in Figma" });
  expect(figma.getAttribute("href")).toBe("https://example.com/figma/hero");
  expect(figma.getAttribute("target")).toBe("_blank");
  expect(figma.getAttribute("rel")).toBe("noreferrer");
  const storybook = screen.getByRole("link", { name: "Open in Storybook" });
  expect(storybook.getAttribute("href")).toBe("https://example.com/storybook/hero");
});

test("hides the arrow glyph from assistive tech, so the link name is the label", () => {
  const { container } = render(<InspectorDocsLinks docs={docs} />);
  const arrows = container.querySelectorAll('[aria-hidden="true"]');
  expect(arrows.length).toBe(2);
});
