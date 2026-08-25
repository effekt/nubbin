// Nubbin keeps the detailed workflows in Claude's files because that surface existed first.
// Codex adapters must cover the same tracked skills and agents without copying their bodies.

import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { describe, expect, it } from "vitest";
import { editedPaths } from "../.codex/hooks/editedPaths.mjs";
import { readFrontmatter } from "../scripts/catalog.mjs";
import { REPO_ROOT } from "./support/repoRoot.mjs";
import { trackedFiles } from "./support/trackedFiles.mjs";

const tracked = trackedFiles(REPO_ROOT);

const namesUnder = (prefix, suffix) =>
  tracked
    .filter((path) => path.startsWith(prefix) && path.endsWith(suffix))
    .map((path) => (suffix === "/SKILL.md" ? path.split("/").at(-2) : basename(path, suffix)))
    .sort();

const claudeSkills = namesUnder(".claude/skills/", "/SKILL.md");
const codexSkills = namesUnder(".agents/skills/", "/SKILL.md");
const claudeAgents = namesUnder(".claude/agents/", ".md");
const codexAgents = namesUnder(".codex/agents/", ".toml");

describe("Codex parity", () => {
  it("exposes every repository skill Claude exposes", () => {
    expect(claudeSkills.length).toBeGreaterThan(0);
    expect(codexSkills).toEqual(claudeSkills);
    for (const name of claudeSkills) {
      const claude = readFileSync(join(REPO_ROOT, ".claude", "skills", name, "SKILL.md"), "utf8");
      const codex = readFileSync(join(REPO_ROOT, ".agents", "skills", name, "SKILL.md"), "utf8");
      expect(readFrontmatter(codex)).toEqual(readFrontmatter(claude));
      expect(codex).toContain(`.claude/skills/${name}/SKILL.md`);
    }
  });

  it("exposes every repository agent Claude exposes", () => {
    expect(claudeAgents.length).toBeGreaterThan(0);
    expect(codexAgents).toEqual(claudeAgents);
    for (const name of claudeAgents) {
      const config = readFileSync(join(REPO_ROOT, ".codex", "agents", `${name}.toml`), "utf8");
      expect(config).toContain(`name = "${name}"`);
      expect(config).toContain(`.claude/agents/${name}.md`);
    }
  });

  it("loads edit and subagent safety hooks", () => {
    const config = JSON.parse(readFileSync(join(REPO_ROOT, ".codex", "hooks.json"), "utf8"));
    expect(Object.keys(config.hooks).sort()).toEqual([
      "PostToolUse",
      "PreToolUse",
      "SubagentStart",
    ]);
    expect(config.hooks.PreToolUse[0].hooks[0].command).toContain(
      "/.codex/hooks/checkWorktree.mjs",
    );
  });

  it("routes the repository rules to agents that do not load Claude path globs", () => {
    const guidance = readFileSync(join(REPO_ROOT, "AGENTS.md"), "utf8");
    expect(guidance).toContain("The `paths` frontmatter under `.claude/rules/` is routing");
    expect(guidance).toContain("read each matching rule completely");
  });

  it("translates every Codex patch file into the shared hook shape", () => {
    const command = [
      "*** Begin Patch",
      "*** Update File: AGENTS.md",
      "*** Add File: .codex/config.toml",
      "*** Delete File: obsolete.md",
      "*** End Patch",
    ].join("\n");
    expect(editedPaths({ tool_input: { command } })).toEqual([
      "AGENTS.md",
      ".codex/config.toml",
      "obsolete.md",
    ]);
    expect(editedPaths({ tool_input: { file_path: "AGENTS.md" } })).toEqual(["AGENTS.md"]);
  });

  it("refuses a Codex patch aimed at the primary worktree", () => {
    const commonDir = execFileSync(
      "git",
      ["rev-parse", "--path-format=absolute", "--git-common-dir"],
      { cwd: REPO_ROOT, encoding: "utf8" },
    ).trim();
    const primaryFile = join(dirname(commonDir), "AGENTS.md");
    const input = JSON.stringify({
      tool_input: { command: `*** Update File: ${primaryFile}` },
    });
    const env = Object.fromEntries(
      Object.entries(process.env).filter(
        ([name]) => !name.startsWith("GIT_") && name !== "NUBBIN_MAIN_TREE_OK",
      ),
    );
    const result = spawnSync(
      process.execPath,
      [join(REPO_ROOT, ".codex", "hooks", "checkWorktree.mjs")],
      { cwd: REPO_ROOT, encoding: "utf8", env, input },
    );

    expect(result.status).toBe(2);
    expect(result.stderr).toContain("Refusing to edit the primary worktree");
  });
});
