#!/usr/bin/env node

// Codex supplies an apply_patch command where Claude supplies one file path. Check every file
// header in that patch against the repository's shared worktree policy before allowing the edit.

import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { editedPaths } from "./editedPaths.mjs";

const OWN_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(OWN_DIR, "../..");
const SHARED_HOOK = resolve(ROOT, "scripts/check-worktree.mjs");

async function payload() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  const raw = chunks.join("");
  return raw.trim() === "" ? {} : JSON.parse(raw);
}

function check(filePath) {
  const targetDir = dirname(resolve(ROOT, filePath));
  return spawnSync(process.execPath, [SHARED_HOOK, targetDir, "--check"], {
    cwd: ROOT,
    encoding: "utf8",
  });
}

export async function checkWorktree() {
  const failures = editedPaths(await payload())
    .map(check)
    .filter((result) => result.status !== 0);

  for (const failure of failures) {
    process.stderr.write(`${failure.stdout ?? ""}${failure.stderr ?? ""}`);
  }

  process.exit(failures.length === 0 ? 0 : 2);
}

if (resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) await checkWorktree();
