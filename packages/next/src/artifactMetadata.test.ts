import type { Artifact } from "@nubbin/core";
import { describe, expect, test } from "vitest";
import { artifactMetadata } from "./artifactMetadata";
import { SUMMER } from "./testing/artifactFixture.constants";

const withMeta = (meta: Artifact["meta"]): Artifact => ({ ...SUMMER, meta });

describe("artifactMetadata", () => {
  test("a null artifact carries no metadata, so the layout's own stands", () => {
    expect(artifactMetadata(null)).toEqual({});
  });

  test("the title reaches the document", () => {
    expect(artifactMetadata(withMeta({ title: "Summer promotions" })).title).toBe(
      "Summer promotions",
    );
  });

  test("an absent optional field is omitted rather than sent as undefined", () => {
    // `exactOptionalPropertyTypes` is on, and Next reads a present `description: undefined` as an
    // instruction to emit an empty tag rather than as an absence.
    expect(Object.keys(artifactMetadata(withMeta({ title: "Only a title" })))).toEqual(["title"]);
  });

  test("description and robots reach the document when the document carries them", () => {
    const metadata = artifactMetadata(
      withMeta({ title: "Pricing", description: "What it costs", robots: "noindex" }),
    );
    expect(metadata.description).toBe("What it costs");
    expect(metadata.robots).toBe("noindex");
  });

  test("canonical is nested under alternates, which is where Next reads it", () => {
    const metadata = artifactMetadata(
      withMeta({ title: "Pricing", canonical: "https://example.com/pricing" }),
    );
    expect(metadata.alternates).toEqual({ canonical: "https://example.com/pricing" });
  });
});
