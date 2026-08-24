---
title: Keeping the Documents Honest
summary: What belongs in a document rather than an issue, and the gates that hold this corpus to it
status: stable
---

# Keeping the documents honest

The index a reader lands on says what each document is for. This says what may be a document at
all, and what checks the ones that are.

## What lives elsewhere

Documents are for things that change with the code and get reviewed in a diff. Two kinds of
content are deliberately not here:

| Content | Where | Why |
|---|---|---|
| Open design questions | [`concepts/domain-model.md`](../concepts/domain-model.md#what-this-model-has-not-settled) | The model must name its unresolved boundaries without silently deciding them. |
| Build order and phasing | Repository planning tools | Sequencing is tracked work, not a contract. A roadmap in prose goes stale when reality disagrees with it. |

[The Nubbin documentation site](https://nubbin.io) is not a third home. It is generated and
published by CI from [the repository's
markdown](../decisions/the-site-publishes-the-repositorys-markdown.md), these documents
included — see
[Generated documents are published, never committed](../decisions/generated-documents-are-published-never-committed.md).

## Keeping them honest

Prose has no compiler, so a wrong sentence here is caught by nothing but a reader who acts on
it and comes unstuck. Gates run against these files on every commit — links and anchors
resolve, no claim rests on a corpus a reader cannot open, nothing reaches back for a name that
no longer exists, no reference identifies a codebase that is not this one, and one claim lives
in one document.

[`.claude/rules/documentation.md`](https://github.com/effekt/nubbin/blob/main/.claude/rules/documentation.md) holds why that is worth
the machinery, and what the gates cannot reach: which document holds what, and the rule that a
decision changes prose in *every* document describing it, in the same commit.
