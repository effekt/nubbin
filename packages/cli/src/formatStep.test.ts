import { describe, expect, test } from "vitest";
import { formatStep } from "./formatStep";

describe("formatStep", () => {
  test("a numbered title, then the command on its own line when there is one", () => {
    const step = { title: "Publish a route", command: "npx nubbin publish /pricing" };
    expect(formatStep(step, 4)).toEqual(["4. Publish a route", "   $ npx nubbin publish /pricing"]);
  });

  test("a step with no command is its title alone", () => {
    expect(formatStep({ title: "Render an artifact" }, 6)).toEqual(["6. Render an artifact"]);
  });

  test("the docs path is not printed: the terminal cannot name the site it is on", () => {
    const step = { title: "Register the components", docs: "reference/authoring/blocks" };
    expect(formatStep(step, 2).join("\n")).not.toContain("reference/authoring/blocks");
  });
});
