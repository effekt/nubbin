import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { readFileOrNull } from "./readFileOrNull";

const freshDir = () => mkdtemp(join(tmpdir(), "nubbin-read-"));

describe("readFileOrNull", () => {
  test("a file that exists reads back as its text", async () => {
    const file = join(await freshDir(), "present.txt");
    await writeFile(file, "hello");
    expect(await readFileOrNull(file)).toBe("hello");
  });

  test("a file that was never written reads as null, not a throw", async () => {
    expect(await readFileOrNull(join(await freshDir(), "absent.txt"))).toBeNull();
  });

  test("any other failure still throws — only absence is a value", async () => {
    // Reading a directory as a file fails with EISDIR, which must not read as null.
    await expect(readFileOrNull(await freshDir())).rejects.toThrow();
  });
});
