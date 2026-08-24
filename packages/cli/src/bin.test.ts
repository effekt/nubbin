import { execFile } from "node:child_process";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { promisify } from "node:util";
import { beforeAll, describe, expect, test } from "vitest";

const run = promisify(execFile);

const PACKAGE_ROOT = resolve(import.meta.dirname, "..");
const BIN = join(PACKAGE_ROOT, "dist", "bin.js");
const FIXTURE = join(PACKAGE_ROOT, "src", "testing", "projectAt.ts");

interface Ran {
  stdout: string;
  stderr: string;
  code: number;
}

/** The binary a consumer runs, in a directory whose config it has to find on its own. */
const nubbin = async (cwd: string, ...args: string[]): Promise<Ran> => {
  try {
    const { stdout, stderr } = await run(process.execPath, [BIN, ...args], { cwd });
    return { stdout, stderr, code: 0 };
  } catch (error) {
    const failure = error as { stdout?: string; stderr?: string; code?: number };
    return { stdout: failure.stdout ?? "", stderr: failure.stderr ?? "", code: failure.code ?? -1 };
  }
};

const project = async (): Promise<string> => {
  const root = await mkdtemp(join(tmpdir(), "nubbin-cli-bin-"));
  await writeFile(
    join(root, "nubbin.config.ts"),
    `import { projectAt } from ${JSON.stringify(FIXTURE)};\n` +
      `export default projectAt(${JSON.stringify(join(root, ".nubbin"))});\n`,
  );
  return root;
};

// The built binary, not the source: what a consumer installs is what these assertions read.
beforeAll(async () => {
  await run("pnpm", ["exec", "tsup"], { cwd: PACKAGE_ROOT });
}, 120_000);

describe("the nubbin binary", () => {
  test("publishes a route, finding the config beside where it was run", async () => {
    const ran = await nubbin(await project(), "publish", "/pricing");
    expect(ran.code).toBe(0);
    expect(ran.stdout.trim()).toMatch(/^published \/pricing -> [0-9a-f]+$/);
  });

  test("exits 1 on a refusal, printing the code it carries — to stderr, not stdout", async () => {
    const ran = await nubbin(await project(), "compile", "/unknown-block");
    expect(ran.code).toBe(1);
    expect(ran.stderr).toContain("unknown-block");
    // The contract a script depends on: stdout carries the answer, or carries nothing.
    expect(ran.stdout).toBe("");
  });

  test("exits 2 with the usage text when given no command", async () => {
    const ran = await nubbin(await project());
    expect(ran.code).toBe(2);
    expect(ran.stderr).toContain("nubbin <command>");
    expect(ran.stdout).toBe("");
  });

  test("exits 2 where there is no config to find, naming what it looked for", async () => {
    const ran = await nubbin(await mkdtemp(join(tmpdir(), "nubbin-cli-nocfg-")), "status");
    expect(ran.code).toBe(2);
    expect(ran.stderr).toContain("nubbin.config.ts");
  });

  test("a hash on stdout is the whole of stdout, so a script can capture it", async () => {
    const ran = await nubbin(await project(), "compile", "/pricing");
    expect(ran.code).toBe(0);
    expect(ran.stdout.trim()).toMatch(/^\/pricing -> [0-9a-f]+$/);
  });
});
