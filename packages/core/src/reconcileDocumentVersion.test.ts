import { describe, expect, test } from "vitest";
import type { DocumentVersion } from "./document.types";
import { reconcileDocumentVersion } from "./reconcileDocumentVersion";

const base = (): DocumentVersion => ({
  documentId: "home",
  version: 1,
  roots: ["hero", "card"],
  elements: {
    hero: { id: "hero", block: "Hero", props: { title: "Before", body: "Body" } },
    card: { id: "card", block: "Card", props: { label: "Read" } },
  },
  meta: { title: "Home", description: "Before" },
  createdAt: "2026-01-01T00:00:00Z",
  createdBy: "author",
});

describe("reconcileDocumentVersion", () => {
  test("merges changes to different fields", () => {
    const ancestor = base();
    const local = structuredClone(ancestor);
    const remote = structuredClone(ancestor);
    const localHero = local.elements.hero;
    const remoteCard = remote.elements.card;
    if (localHero === undefined || remoteCard === undefined) throw new Error("fixture lost a node");
    localHero.props.title = "Local";
    remoteCard.props.label = "Remote";

    const result = reconcileDocumentVersion(ancestor, local, remote);

    expect(result.conflicts).toEqual([]);
    expect(result.version.elements.hero?.props.title).toBe("Local");
    expect(result.version.elements.card?.props.label).toBe("Remote");
  });

  test("records a same-path conflict and keeps the local working value", () => {
    const ancestor = base();
    const local = structuredClone(ancestor);
    const remote = structuredClone(ancestor);
    const localHero = local.elements.hero;
    const remoteHero = remote.elements.hero;
    if (localHero === undefined || remoteHero === undefined)
      throw new Error("fixture lost its hero");
    localHero.props.title = "Local";
    remoteHero.props.title = "Remote";

    const result = reconcileDocumentVersion(ancestor, local, remote);

    expect(result.version.elements.hero?.props.title).toBe("Local");
    expect(result.conflicts).toEqual([
      {
        path: ["elements", "hero", "props", "title"],
        base: { present: true, value: "Before" },
        local: { present: true, value: "Local" },
        remote: { present: true, value: "Remote" },
      },
    ]);
  });

  test("treats competing order changes as one explicit conflict", () => {
    const ancestor = base();
    const local = { ...ancestor, roots: ["card", "hero"] };
    const remote = { ...ancestor, roots: ["hero"] };

    const result = reconcileDocumentVersion(ancestor, local, remote);

    expect(result.version.roots).toEqual(["card", "hero"]);
    expect(result.conflicts.map(({ path }) => path)).toEqual([["roots"]]);
  });

  test("refuses versions from different documents", () => {
    const ancestor = base();
    expect(() =>
      reconcileDocumentVersion(ancestor, ancestor, { ...ancestor, documentId: "other" }),
    ).toThrow("different documents");
  });
});
