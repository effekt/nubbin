import { Renderer } from "@nubbin/react";
import studioConfig from "@nubbin/studio-config";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import { blockPreviewArtifact } from "./blockPreviewArtifact";

test("Hero's artifact renders to the real block's HTML, defaults and all", async () => {
  const artifact = blockPreviewArtifact("Hero");
  expect(artifact).toBeDefined();
  if (artifact === undefined) {
    return;
  }
  const html = renderToStaticMarkup(
    await Renderer({
      artifact,
      registry: studioConfig.blockRegistry,
      resolveHole: studioConfig.resolveHole,
    }),
  );
  expect(html).toContain("The water tells you first");
});

test("a min-slot block compiles with its slot inhabited, not refused as empty", () => {
  const artifact = blockPreviewArtifact("CardGrid");
  expect(artifact?.tree[0]?.slots?.cards).toHaveLength(1);
  expect(artifact?.tree[0]?.slots?.cards?.[0]?.block).toBe("Card");
});

test("a name the catalog does not hold is undefined — the page's 404", () => {
  expect(blockPreviewArtifact("NoSuchBlock")).toBeUndefined();
});

test("a data-hinted block's artifact carries holes for the studio resolver to fill", () => {
  const artifact = blockPreviewArtifact("LiveBand");
  expect(artifact?.tree[0]?.holes?.items).toBeDefined();
});
