import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { readPlanText } from "./readPlanText";
import { UsageError } from "./UsageError";

const directory = (): Promise<string> => mkdtemp(join(tmpdir(), "nubbin-cli-plan-text-"));

describe("readPlanText", () => {
  test("reads a path relative to the working directory", async () => {
    const cwd = await directory();
    await writeFile(join(cwd, "plan.json"), "{}");
    expect(await readPlanText(cwd, "plan.json")).toBe("{}");
  });

  test("reads an absolute path as given", async () => {
    const cwd = await directory();
    const elsewhere = await directory();
    await writeFile(join(elsewhere, "plan.json"), "[]");
    expect(await readPlanText(cwd, join(elsewhere, "plan.json"))).toBe("[]");
  });

  test("a byte order mark, as PowerShell's redirection writes one, is not part of the text", async () => {
    const cwd = await directory();
    await writeFile(join(cwd, "plan.json"), "﻿{}");
    expect(await readPlanText(cwd, "plan.json")).toBe("{}");
  });

  test("a missing file is named as missing, as the argument was typed", async () => {
    const attempt = readPlanText(await directory(), "./plans/plan.json");
    await expect(attempt).rejects.toThrow(UsageError);
    await expect(attempt).rejects.toThrow("no plan file at ./plans/plan.json");
  });

  test("any other failure to read names the argument and carries the cause", async () => {
    const cwd = await directory();
    const attempt = readPlanText(cwd, ".");
    await expect(attempt).rejects.toThrow(UsageError);
    await expect(attempt).rejects.toThrow(/^could not read \.: EISDIR/);
  });
});
