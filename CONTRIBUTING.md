---
title: Contributing
summary: Setup, repository checks, and the kinds of contribution Nubbin accepts
status: stable
---

# Contributing

Read [`AGENTS.md`](AGENTS.md) first. It documents the invariants and the commands, and routes
to everything else; the gates are in [`docs/gates.md`](docs/gates.md). This file covers setup
and contribution guidance.

## Setup

```bash
nvm install && nvm use     # reads .nvmrc
corepack enable pnpm       # activates the pinned pnpm
pnpm install               # sets core.hooksPath and installs the git hooks via `prepare`
pnpm verify                # every gate
```

If a git hook later reports `pnpm: command not found`, the toolchain is missing from that
shell's PATH rather than from the machine — the hooks shell out to `pnpm` directly.

Two gates are plain Node and need no install, which is why CI runs them against a bare
checkout. Everything else is a test, so it needs one:

```bash
node scripts/check-prose.mjs --check
node scripts/check-a11y.mjs --check
```

Node 22+ (24 pinned in `.nvmrc`) and pnpm are required; `packageManager` in `package.json`
pins the exact pnpm version.

## What to contribute

Contributions can improve code, documentation, examples, or the design itself. Start with an
issue when a change affects an architectural invariant or crosses package boundaries.

Open design questions are listed in
[`docs/domain-model.md`](docs/domain-model.md#what-this-model-has-not-settled). Each records
what deciding it late would cost. Open a discussion with the Design question template before
implementing one.

[`docs/decisions/`](docs/decisions/README.md) records settled choices and their reasoning. A
proposal to reverse one should address that reasoning as well as the conclusion.

## Opening an issue

From a clone, the scaffold drafts and checks one:

```bash
pnpm run --silent issue-scaffold --template > /tmp/draft.md
pnpm run issue-scaffold --body-file /tmp/draft.md --title "…"
```

It reads the open issues for ones already covering the ground, states how many it read, and
refuses a draft missing cause, reason, decision, choice or a close condition. Nothing is
created without `--open`, so running it costs a look at the tracker and nothing else.

An issue opened from the web forms is welcome and held to the same content: the parts are what
make it answerable, and the close condition is what lets it close. [`AGENTS.md`](AGENTS.md)
covers both.

## Documentation changes

Read [`.claude/rules/documentation.md`](.claude/rules/documentation.md) before editing anything
under `docs/` — it covers frontmatter, which document holds what, and the rule that a rename
leaves no trace of the old name.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/), checked by commitlint on every
PR. `commitlint.config.mjs` holds the scopes it accepts; that list grows as packages land.

**The subject must start lowercase.** `subject-case` rejects sentence, start, pascal and upper
case, so a subject opening with a type name or an acronym fails — `feat(core): InferProps…` and
`fix(repo): CI installed…` were both rejected. Rephrase so the first word is ordinary prose.

## Code

The invariants in `AGENTS.md` and the gates in `docs/gates.md` apply in full: one unit per file, every dependency pinned,
`pnpm verify` green before review. If a gate seems to make correct code impossible to write,
that's worth raising — as an issue, not a workaround.

`pnpm verify` needs a full install. The prose gates above do not, so a documentation-only
change can be checked without one.
