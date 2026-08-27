import { describe, expect, it } from "vitest";
import { defaultPlan } from "./defaultPlan";
import { derivePackages } from "./derivePackages";
import type { Plan } from "./plan.types";

describe("derivePackages", () => {
  it("lists what a self-hosted Next.js plan installs", () => {
    expect(derivePackages(defaultPlan)).toEqual([
      { name: "@nubbin/core", dev: false },
      { name: "@nubbin/react", dev: false },
      { name: "@nubbin/next", dev: false },
      { name: "@nubbin/store-fs", dev: false },
      { name: "@nubbin/studio", dev: false },
      { name: "@nubbin/studio-ui", dev: false },
      { name: "@nubbin/cli", dev: true },
    ]);
  });

  it("drops the Next binding for another framework", () => {
    const names = derivePackages({ ...defaultPlan, framework: "react" }).map((ref) => ref.name);
    expect(names).not.toContain("@nubbin/next");
    expect(names).toContain("@nubbin/react");
  });

  it("drops the store, the studio and the command line when Nubbin runs them", () => {
    const plan: Plan = {
      ...defaultPlan,
      framework: "other",
      artifacts: "nubbin",
      studio: "nubbin",
      publishing: "nubbin",
    };
    expect(derivePackages(plan)).toEqual([
      { name: "@nubbin/core", dev: false },
      { name: "@nubbin/react", dev: false },
    ]);
  });

  it("marks the command line as a development dependency", () => {
    expect(derivePackages(defaultPlan).filter((ref) => ref.dev)).toEqual([
      { name: "@nubbin/cli", dev: true },
    ]);
  });
});
