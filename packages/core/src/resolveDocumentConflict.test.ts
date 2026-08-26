import { expect, test } from "vitest";
import type { DocumentVersion } from "./document.types";
import { resolveDocumentConflict } from "./resolveDocumentConflict";

const version: DocumentVersion = {
  documentId: "home",
  version: 1,
  roots: ["hero"],
  elements: { hero: { id: "hero", block: "Hero", props: { title: "Local" } } },
  meta: { title: "Home" },
  createdAt: "2026-01-01T00:00:00Z",
  createdBy: "author",
};

test("applies the selected side without mutating the working copy", () => {
  const resolved = resolveDocumentConflict(
    version,
    {
      path: ["elements", "hero", "props", "title"],
      base: { present: true, value: "Before" },
      local: { present: true, value: "Local" },
      remote: { present: true, value: "Remote" },
    },
    "remote",
  );
  expect(resolved.elements.hero?.props.title).toBe("Remote");
  expect(version.elements.hero?.props.title).toBe("Local");
});

test("can keep a deletion selected by one side", () => {
  const resolved = resolveDocumentConflict(
    version,
    {
      path: ["elements", "hero", "props", "title"],
      base: { present: true, value: "Before" },
      local: { present: true, value: "Local" },
      remote: { present: false },
    },
    "remote",
  );
  expect(resolved.elements.hero?.props).toEqual({});
});
