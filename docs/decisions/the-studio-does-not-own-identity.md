---
title: "The studio does not own identity"
summary: Caller identity is optional host input, separate from the structural identifiers Nubbin uses
status: stable
---

# The studio does not own identity

The studio writes drafts and can request publication, but that does not imply an account
system. A personal site may have one operator, overwrite one file, and label every change
`"studio"`. A larger deployment may need authentication, authorization, audit identity, and
presence. Both must fit the same editor contract.

Nubbin therefore requires no user account, globally unique author id, session, or identity
provider. If a host needs an access boundary, it puts one in front of the studio or enforces
it inside the callbacks it supplies. If it needs attribution, it supplies a provenance label
such as an email address, internal user id, `"anonymous"`, `"cli"`, or `"studio"`.
`DocumentVersion.createdBy` records that label; it is not an authentication credential or
proof of identity.

Document ids, node ids, and draft revisions are a different concern. They address content so
edits, references, and reconciliation remain deterministic. The CLI and reference studio can
mint them, while callers may provide readable values such as `"home"` and `"hero"`. They need
only be stable in the scope where they are referenced; Nubbin does not require a central id
service. A host may overwrite the same document in the same file on every save.

Built-in users, sessions, and a mandatory `IdentityProvider` were rejected. They would turn
an optional host policy into operated infrastructure and make the simplest file-backed setup
pay for a multi-user concern. Presence and audit integrations may carry host-supplied actor or
connection labels, but those labels do not change the identity boundary.
