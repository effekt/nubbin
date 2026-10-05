import { describe, expect, test } from "vitest";
import { defaultPlan } from "./plan/defaultPlan";
import { UsageError } from "./UsageError";
import { validatePlan } from "./validatePlan";

/** The refusal as a `UsageError`, so its detail lines can be read. */
const refusalOf = async (argument: string, value: unknown): Promise<UsageError> => {
  try {
    await validatePlan(argument, value);
  } catch (error) {
    if (error instanceof UsageError) return error;
    throw error;
  }
  throw new Error("validatePlan accepted a value it should have refused");
};

describe("validatePlan", () => {
  test("hands a value the schema accepts back as a plan", async () => {
    expect(await validatePlan("plan.json", { ...defaultPlan })).toEqual(defaultPlan);
  });

  test("a shape the schema refuses names the argument, then one line per issue", async () => {
    const refusal = await refusalOf("plan.json", { ...defaultPlan, drafts: "someone" });
    expect(refusal.message).toBe("plan.json is not a plan:");
    expect(refusal.details).toEqual(["  drafts: Expected one of: self, nubbin."]);
  });

  test("every missing field is listed, not only the first", async () => {
    const refusal = await refusalOf("plan.json", {});
    expect(refusal.details.length).toBe(Object.keys(defaultPlan).length);
    expect(refusal.details[0]).toBe("  framework: Expected one of: next, react, other.");
  });

  test("a value that is no object at all is one line with no field", async () => {
    const refusal = await refusalOf("plan.json", 42);
    expect(refusal.details).toEqual(["  Expected an object carrying every plan field."]);
  });
});
