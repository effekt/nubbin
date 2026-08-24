#!/usr/bin/env node
import { ExitCode } from "./exitCode.constants";
import { runCli } from "./runCli";

const outcome = await runCli(process.argv.slice(2), process.cwd());
// Refusals and usage errors go to stderr, and so do warnings, so `HASH=$(nubbin compile
// /pricing)` captures a hash or captures nothing — never a complaint about why there is no
// hash, and never a warning riding along beside one.
const stream = outcome.code === ExitCode.Done ? process.stdout : process.stderr;
for (const line of outcome.lines) {
  stream.write(`${line}\n`);
}
for (const warning of outcome.warnings ?? []) {
  process.stderr.write(`${warning}\n`);
}
process.exitCode = outcome.code;
