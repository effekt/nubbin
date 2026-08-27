---
paths: "packages/**/*.ts, packages/**/*.tsx, apps/**/*.ts, apps/**/*.tsx, .jscpd.json"
title: Duplication
summary: The jscpd threshold is a ceiling for the whole corpus, not a budget for the change in front of you
status: stable
---

# Duplication

> **New duplication is a defect at any ratio. The threshold exists to fail the build, not to tell you how much you may add.**

## Why

`pnpm dupes` fails above 1% duplicated tokens across `packages/` and `apps/`. Read as a
budget, that number invites exactly the reasoning it was written to stop: "0.97%, still under
the line, ship it". Every change that reasons that way is correct on its own and the corpus
ratchets upward until the one that crosses the line is a change with nothing to do with the
copies it is blamed for. The person who then has to fix it owns none of the duplication.

The same reasoning produced the `ignore` list in `.jscpd.json`: 25 named files, each
excluded because it looked like the fields beside it. An exclusion is the threshold moving
one file at a time.

## Rules

### Read the number before and after, and it must not go up

```bash
pnpm dupes                     # before: 0.71%
# ... your change ...
pnpm dupes                     # after:  0.71% or lower — anything higher is yours to remove
```

A rise is the finding, wherever it lands relative to the threshold. **Gate:** `jscpd` at the
threshold only — nothing measures the delta, which is why this rule exists.

### Two similar blocks are one unit and a parameter

```ts
// WRONG — the second field is the first with a different label and input type
export function NumberInputField({ value, onChange }: Props) {
  return <label className="field"><span>Number</span><input type="number" … /></label>;
}
export function PlainTextField({ value, onChange }: Props) {
  return <label className="field"><span>Text</span><input type="text" … /></label>;
}

// CORRECT — the shared shape has a name; each field is what differs
export function ScalarField({ label, type, value, onChange }: ScalarFieldProps) { … }
```

If the shared part has no obvious name, that is the signal it was not understood yet, not a
reason to keep two copies. `single-concern.md` is the same rule at the function level.

### An exclusion names a reason that is not "it looked similar"

Legitimate exclusions exist: a contract suite that constructs a fresh store per test, or
example blocks that demonstrate composition by sharing a shape. Each one in `.jscpd.json`
carries its reason in `gates.md` under *A tuned threshold is not a waived one*. A file
excluded because extracting the shared part was inconvenient is duplication with the
detector turned off, and the next similar file is excluded on the precedent.

Do not add a file to `ignore`. Do not raise `threshold`. Do not lower `minTokens` for one
change and restore it for the next. **Gate:** none — the config is editable, and a review
that reads `.jscpd.json` in the diff is the only thing that sees it.

## Checklist

- [ ] `pnpm dupes` before and after, and the after number is not higher
- [ ] Anything jscpd names is extracted, not excluded
- [ ] `.jscpd.json` is untouched, or the diff explains a reason that is not similarity
- [ ] The shared unit has a name that says what it is, per `source-layout.md`
