// The guard judges a path that does not exist yet by its nearest existing ancestor.
//
// During #533 it refused a `Write` aimed at a new directory inside a linked worktree and named
// the primary tree in the refusal: the target's directory failed `existsSync`, and the fallback
// was `process.cwd()` — wherever the hook happened to run. These tests seed exactly that case.
//
// The script scopes its authority to the repository it lives in (`OWN_COMMON_DIR` comes from its
// own location), so running it in place would answer "another repository — nothing to enforce"
// for any scratch fixture. Each test therefore copies the script into a scratch repository and
// runs that copy, which also exercises `--hook` mode end to end: stdin payload, exit code, and
// the message an agent would read.

import { execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, realpathSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const SCRIPTS_DIR = dirname(fileURLToPath(import.meta.url));

let scratch;
let primary;
let linked;
let uninstalled;

/**
 * `process.env` with every `GIT_*` variable removed, plus the guard's escape hatch.
 *
 * This suite runs under pre-commit, and a git hook's children inherit `GIT_DIR` and
 * `GIT_INDEX_FILE` aimed at the repository being committed to. The first commit of this file
 * proved what that means: the fixture's `git init` reinitialised the real repository as bare,
 * its `commit` landed a stray commit on the real branch, and its `worktree add` registered two
 * scratch worktrees against the real repository. Every child process here gets this env so the
 * fixture's git can only ever see the scratch repository.
 */
function scrubbedEnv() {
  const env = { ...process.env };
  for (const key of Object.keys(env)) {
    if (key.startsWith("GIT_")) delete env[key];
  }
  delete env.NUBBIN_MAIN_TREE_OK;
  return env;
}

const git = (cwd, ...args) =>
  execFileSync("git", ["-c", "user.email=test@example.invalid", "-c", "user.name=test", ...args], {
    cwd,
    env: scrubbedEnv(),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

/** Runs the scratch repository's copy of the guard in `--hook` mode against one file path. */
function runHook(filePath) {
  return spawnSync(process.execPath, [join(primary, "scripts", "check-worktree.mjs"), "--hook"], {
    cwd: scratch,
    env: scrubbedEnv(),
    encoding: "utf8",
    input: JSON.stringify({ tool_input: { file_path: filePath } }),
  });
}

beforeAll(() => {
  // `realpathSync` because macOS hands out `/var/folders/…` for a directory that lives under
  // `/private/var/…`, and git reports the resolved path; resolving here keeps the two comparable.
  scratch = realpathSync(mkdtempSync(join(tmpdir(), "check-worktree-")));
  primary = join(scratch, "primary");
  linked = join(scratch, "linked");
  uninstalled = join(scratch, "uninstalled");

  mkdirSync(primary);
  git(primary, "init");
  git(primary, "commit", "--allow-empty", "-m", "root");
  mkdirSync(join(primary, "scripts"));
  for (const file of ["check-worktree.mjs", "git-worktrees.mjs"]) {
    copyFileSync(join(SCRIPTS_DIR, file), join(primary, "scripts", file));
  }

  git(primary, "worktree", "add", "-b", "installed", linked);
  git(primary, "worktree", "add", "-b", "bare-checkout", uninstalled);
  // What `gatesCanRun` looks for; only `linked` gets it.
  mkdirSync(join(linked, "node_modules", "lefthook"), { recursive: true });
});

afterAll(() => {
  rmSync(scratch, { recursive: true, force: true });
});

describe("check-worktree --hook, aimed at a directory that does not exist yet", () => {
  it("passes a write into a new directory of an installed linked worktree", () => {
    const result = runHook(join(linked, "newdir", "file.ts"));
    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("linked worktree");
  });

  it("still refuses the same write under the primary tree, naming the primary tree", () => {
    const result = runHook(join(primary, "newdir", "file.ts"));
    expect(result.status).toBe(2);
    expect(result.stderr).toContain(`primary worktree at ${primary}`);
  });

  it("still refuses it in a linked worktree whose gates cannot run", () => {
    const result = runHook(join(uninstalled, "newdir", "file.ts"));
    expect(result.status).toBe(2);
    expect(result.stderr).toContain(`${uninstalled} has no installed lefthook`);
  });

  it("classifies a deep target the same as a shallow one", () => {
    const result = runHook(join(linked, "app", "api", "draft", "route.ts"));
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("linked worktree");
  });
});

describe("check-worktree --hook, aimed at a directory that exists", () => {
  it("passes the installed linked worktree", () => {
    const result = runHook(join(linked, "file.ts"));
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("linked worktree");
  });

  it("refuses the primary tree", () => {
    const result = runHook(join(primary, "file.ts"));
    expect(result.status).toBe(2);
    expect(result.stderr).toContain(`primary worktree at ${primary}`);
  });
});
