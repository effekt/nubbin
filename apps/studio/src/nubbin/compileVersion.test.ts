import { NubbinError, setNodeProp } from "@nubbin/core";
import { home } from "demo/fixtures/home";
import { expect, test } from "vitest";
import { compileVersion } from "./compileVersion";

test("compiles a fixture document to an artifact at the given route", () => {
  const artifact = compileVersion(home, "/");
  expect(artifact.route).toBe("/");
  expect(artifact.documentId).toBe("home");
});

test("a candidate that fails validation throws NubbinError naming the path", () => {
  const broken = setNodeProp(home, "hero", "cta.href", 7);
  try {
    compileVersion(broken, "/");
    expect.unreachable("an invalid draft must not compile");
  } catch (error) {
    if (!(error instanceof NubbinError)) {
      throw error;
    }
    expect(error.issues.some((issue) => issue.at === "hero")).toBe(true);
  }
});
