import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { hasErrorCode } from "./hasErrorCode";

describe("hasErrorCode", () => {
  test("matches the code a filesystem error carries", async () => {
    const path = join(await mkdtemp(join(tmpdir(), "nubbin-cli-code-")), "taken");
    await writeFile(path, "");
    const error = await writeFile(path, "", { flag: "wx" }).then(
      () => null,
      (raised: unknown) => raised,
    );
    expect(hasErrorCode(error, "EEXIST")).toBe(true);
    expect(hasErrorCode(error, "ENOENT")).toBe(false);
  });

  test("an error with no code, or a value that is no error, matches nothing", () => {
    expect(hasErrorCode(new Error("EEXIST in the message only"), "EEXIST")).toBe(false);
    expect(hasErrorCode({ code: "EEXIST" }, "EEXIST")).toBe(false);
    expect(hasErrorCode("EEXIST", "EEXIST")).toBe(false);
  });
});
