import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { decodePlan } from "./plan/decodePlan";
import { defaultPlan } from "./plan/defaultPlan";
import { readPlanArgument } from "./readPlanArgument";
import { UsageError } from "./UsageError";

const directory = (): Promise<string> => mkdtemp(join(tmpdir(), "nubbin-cli-plan-arg-"));

describe("readPlanArgument", () => {
  test("a code decodes to its plan without touching the disk", async () => {
    expect(await readPlanArgument(await directory(), "v1-aaaaabaa000aaa")).toEqual(
      decodePlan("v1-aaaaabaa000aaa"),
    );
  });

  test("a code that decodes to nothing is refused as a code, not looked for as a file", async () => {
    const attempt = readPlanArgument(await directory(), "v1-zzz");
    await expect(attempt).rejects.toThrow(UsageError);
    await expect(attempt).rejects.toThrow("not a plan code: v1-zzz");
  });

  test("anything else is a path, resolved against the working directory", async () => {
    const cwd = await directory();
    await writeFile(join(cwd, "plan.json"), JSON.stringify(defaultPlan));
    expect(await readPlanArgument(cwd, "plan.json")).toEqual(defaultPlan);
  });

  test("a file that is not a plan is refused with the schema's issues", async () => {
    const cwd = await directory();
    await writeFile(join(cwd, "plan.json"), JSON.stringify({ ...defaultPlan, network: "mesh" }));
    await expect(readPlanArgument(cwd, "plan.json")).rejects.toThrow("plan.json is not a plan:");
  });
});
