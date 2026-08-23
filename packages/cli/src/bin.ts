#!/usr/bin/env node
import { runCli } from "./runCli";

const outcome = await runCli(process.argv.slice(2), process.cwd());
for (const line of outcome.lines) {
  process.stdout.write(`${line}\n`);
}
process.exitCode = outcome.code;
