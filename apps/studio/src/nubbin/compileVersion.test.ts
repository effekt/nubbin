import { NubbinError, setNodeProp } from "@nubbin/core";
import { about } from "demo/fixtures/about";
import { expect, test } from "vitest";
import { compileVersion } from "./compileVersion";

test("compiles a fixture document to an artifact at the given route", () => {
  const artifact = compileVersion(about, "/about");
  expect(artifact.route).toBe("/about");
  expect(artifact.documentId).toBe("about");
});

test("a candidate that fails validation throws NubbinError naming the path", () => {
  const broken = setNodeProp(about, "hero", "cta.href", 7);
  try {
    compileVersion(broken, "/about");
    expect.unreachable("an invalid draft must not compile");
  } catch (error) {
    if (!(error instanceof NubbinError)) {
      throw error;
    }
    expect(error.issues.some((issue) => issue.at === "hero")).toBe(true);
  }
});
