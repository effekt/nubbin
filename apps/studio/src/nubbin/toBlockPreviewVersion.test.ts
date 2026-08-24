import { catalog } from "demo/src/nubbin/catalog";
import { registry } from "demo/src/nubbin/registry";
import { expect, test } from "vitest";
import { compileVersion } from "./compileVersion";
import { toBlockPreviewVersion } from "./toBlockPreviewVersion";

test("the version holds one root, named after the block it previews", () => {
  const version = toBlockPreviewVersion("Hero", catalog, registry);
  expect(version.roots).toHaveLength(1);
  expect(version.elements[version.roots[0] ?? ""]?.block).toBe("Hero");
  expect(version.meta.title).toBe("Hero");
});

test("every catalog block's preview document compiles — required slots included", () => {
  for (const block of Object.keys(catalog)) {
    const version = toBlockPreviewVersion(block, catalog, registry);
    expect(() => compileVersion(version, `/block-preview/${block}`), block).not.toThrow();
  }
});
