import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { appendJsonLine } from "./appendJsonLine";

const freshFile = async () => join(await mkdtemp(join(tmpdir(), "nubbin-append-")), "log.jsonl");

describe("appendJsonLine", () => {
  test("creates the directory and file on the first append", async () => {
    const file = await freshFile();
    await appendJsonLine(file, { n: 1 });
    expect(await readFile(file, "utf8")).toBe('{"n":1}\n');
  });

  test("a second append extends the file rather than replacing it", async () => {
    const file = await freshFile();
    await appendJsonLine(file, { n: 1 });
    await appendJsonLine(file, { n: 2 });
    expect(await readFile(file, "utf8")).toBe('{"n":1}\n{"n":2}\n');
  });

  test("concurrent appends all land — no read-modify-write to lose one", async () => {
    const file = await freshFile();
    const writers = [1, 2, 3, 4, 5, 6, 7, 8];
    await Promise.all(writers.map((n) => appendJsonLine(file, { n })));
    const lines = (await readFile(file, "utf8")).split("\n").filter((line) => line !== "");
    expect(lines).toHaveLength(writers.length);
  });
});
