#!/usr/bin/env node

// Codex supplies an apply_patch command where Claude supplies one file path. Translate every
// file header in that patch into the payload the repository's shared per-file hook consumes.

import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { editedPaths } from "./editedPaths.mjs";

const OWN_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(OWN_DIR, "../..");
const SHARED_HOOK = resolve(ROOT, "scripts/hook-check-file.mjs");

async function payload() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  const raw = chunks.join("");
  return raw.trim() === "" ? {} : JSON.parse(raw);
}

function check(filePath) {
  const absolutePath = resolve(ROOT, filePath);
  const input = JSON.stringify({ tool_input: { file_path: absolutePath } });
  return spawnSync(process.execPath, [SHARED_HOOK], {
    cwd: ROOT,
    encoding: "utf8",
    input,
  });
}

export async function checkFile() {
  const failures = editedPaths(await payload())
    .map(check)
    .filter((result) => result.status !== 0);

  for (const failure of failures) {
    process.stderr.write(`${failure.stdout ?? ""}${failure.stderr ?? ""}`);
  }

  process.exit(failures.length === 0 ? 0 : 2);
}

if (resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) await checkFile();
