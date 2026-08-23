import { type ChildProcess, spawn } from "node:child_process";
import { once } from "node:events";
import { createInterface } from "node:readline";
import { waitForDemoAnswer } from "./waitForDemoAnswer";

/** Long enough for a cold Turbopack start on a loaded machine, short enough to fail a hung one. */
const READY_TIMEOUT_MS = 120_000;

export interface DemoServer {
  origin: string;
  stop: () => Promise<void>;
}

/**
 * Starts the demo on its own port and resolves once it is answering requests — never after a
 * fixed sleep, which passes on a fast machine and fails on a slow one for reasons that look like
 * the code under test.
 *
 * `PORT` is exported as well as passed, because the demo's hole resolver builds its own origin
 * from it: a server on 3100 whose resolver still fetched 3000 would resolve holes against
 * whatever else happened to be listening, and the loop would pass by accident.
 */
export async function startDemoServer(port: number): Promise<DemoServer> {
  const origin = `http://127.0.0.1:${port}`;
  const child: ChildProcess = spawn("pnpm", ["exec", "next", "dev", "--port", String(port)], {
    cwd: new URL("..", import.meta.url).pathname,
    env: { ...process.env, PORT: String(port) },
    stdio: ["ignore", "pipe", "pipe"],
  });

  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`demo did not report ready within ${READY_TIMEOUT_MS}ms`)),
      READY_TIMEOUT_MS,
    );
    child.once("exit", (code) => reject(new Error(`demo exited with ${code} before serving`)));
    for (const stream of [child.stdout, child.stderr]) {
      if (stream === null) {
        continue;
      }
      createInterface({ input: stream }).on("line", (line) => {
        // Checked before the ready banner, because Next prints the banner *and then* refuses:
        // a second `next dev` for one project directory announces "Ready in 148ms" and its
        // Local URL, then exits with this line. Matching ready first cost two minutes of
        // polling a port nothing was ever going to bind.
        if (/Another next dev server is already running/.test(line)) {
          clearTimeout(timer);
          reject(new Error("a dev server already holds this project directory — stop it first"));
          return;
        }
        if (/Ready in|Local:\s+http/.test(line)) {
          clearTimeout(timer);
          resolve();
        }
      });
    }
  });
  await waitForDemoAnswer(origin, READY_TIMEOUT_MS);

  return {
    origin,
    stop: async () => {
      child.kill("SIGTERM");
      await once(child, "exit");
    },
  };
}
