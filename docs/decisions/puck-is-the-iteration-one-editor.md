---
title: Puck is the iteration-one editor
summary: Why the first full authoring loop ships on Puck while drafts stay Nubbin documents
status: stable
---

# Puck is the iteration-one editor

The studio's first full authoring loop — palette, outline, drag, field editing, undo — is
built on [Puck](https://puckeditor.com), not written against dnd-kit. The constrained
editor is the blocker to any non-developer using Nubbin at all, and every week spent
building an editor shell is a week in which no author has used one. Puck ships that shell;
what it cannot ship — Nubbin's schema-derived fields, slot legality, compile and publish —
is the part worth writing.

Puck was previously rejected, and the rejection was scoped to the end state: its canvas
renders its own component tree, so it cannot be the iframe over a consumer's real app that
[the studio architecture](../concepts/studio.md) commits to. Iteration one is not that
case. It edits the demo's blocks through a workspace dependency — plain presentational
React components the studio can hand to Puck's canvas directly — so the limitation that
disqualified Puck for the end state does not reach it.

The boundary that keeps Puck replaceable is the draft format. A draft on disk is a Nubbin
document, never Puck's own data shape: an adapter derives Puck's `Data` from the document
on load and folds every change back on commit, ids stay Nubbin's, and slot legality maps
`SlotConstraint.allow` onto Puck's slot `allow`. The CLI's composition verbs and the studio
therefore edit the same file, compile runs on every save, and replacing Puck's shell with
the dnd-kit canvas later is a UI swap, not a draft migration.

Chosen over building the shell on dnd-kit now — still the settled library for the
iframe-of-the-real-app canvas, and untouched by this decision. Building that canvas first
means solving cross-frame drag, the studio's hardest problem, before any author has
touched an editor; it spends the largest effort on the least-validated risk. Also chosen
over storing Puck's `Data` as the draft, which would have halved the adapter and cost the
draft model its independence: compile could no longer run mid-edit, the CLI could not read
drafts, and unseating Puck would mean migrating every draft.
