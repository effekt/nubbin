---
title: Security Policy
summary: How to report a vulnerability privately
status: stable
---

# Security

## Reporting a vulnerability

Use GitHub's private vulnerability reporting: open the
[Security tab](https://github.com/effekt/nubbin/security) on this repository and select
**Report a vulnerability**. That reaches the maintainer directly and privately.

Do not open a public issue for a suspected vulnerability.

## Scope

The security surface includes the packages, the tooling in `scripts/`, and the workflows in
`.github/workflows/`. Report anything that could run untrusted code, expose data, or bypass a
security gate. An artifact carrying executable content is in scope because
[artifacts contain data, never code](docs/decisions/artifacts-contain-data-never-code.md) is a
security constraint rather than a preference. Report that here rather than filing it as a bug.

## What to expect

No SLA and no bounty — this is a single-maintainer project. You'll get a response, and
credit in the fix if you want it.
