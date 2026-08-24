import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { repositoryRootAbove } from "./repositoryRootAbove";

describe("repositoryRootAbove", () => {
  test("names the nearest directory carrying .git, from anywhere inside it", async () => {
    const root = await mkdtemp(join(tmpdir(), "nubbin-cli-root-"));
    await mkdir(join(root, ".git"));
    const app = join(root, "apps", "web");
    await mkdir(app, { recursive: true });
    expect(await repositoryRootAbove(app)).toBe(root);
  });

  test("a .git file counts too, because a linked worktree carries one instead of a directory", async () => {
    const root = await mkdtemp(join(tmpdir(), "nubbin-cli-linked-"));
    await writeFile(join(root, ".git"), "gitdir: elsewhere");
    expect(await repositoryRootAbove(root)).toBe(root);
  });

  test("answers null where nothing above is a repository", async () => {
    expect(await repositoryRootAbove(await mkdtemp(join(tmpdir(), "nubbin-cli-bare-")))).toBeNull();
  });
});
