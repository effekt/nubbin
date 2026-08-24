---
title: Publishing has a driver that is not an editor
summary: Why the publish path ships as a command line, and what that CLI is not allowed to decide
status: stable
---

# Publishing has a driver that is not an editor

`@nubbin/cli` ships a `nubbin` executable and a `defineConfig` for the file it reads. Six
commands drive the published surface — compile, publish, unpublish, rollback, status, check —
and the package holds no rules of its own. Legality belongs to `compile`, cascade to
`removeNode`, compatibility to `checkRollback`. A terminal, a CI job and an editor are three
callers of one contract rather than three implementations of one behaviour.

Composition is the product and an editor is one way to drive it, but the only shipped way to put
a page live was a script written against one repository's layout. Every further caller would
write another, each free to disagree about the order of the two writes — and an artifact
published before it is stored is a live 404, which is not a thing to rediscover per consumer.

The config is TypeScript beside the application it configures, imported through `jiti`. A
consumer's config imports their catalog and registry the way the rest of their application
imports them: extensionless, often aliased. Requiring compiled JavaScript instead was rejected as
a setup step that fails quietly — the config that runs is then the one built last, not the one on
disk.

**Exported functions with no executable** was the close alternative, and it is what the demo
already does. It loses on portability: every consumer writes their own entry script, so the
invocation differs in each repository, no argument is documented once, and there is nothing for a
CI job to call by name.

**A CLI that also composes documents** — `init`, and verbs that add, move or remove nodes — was
rejected for the first release. Those verbs need somewhere to read and write documents, and
[the authoring store has no settled
interface](../concepts/domain-model.md#what-this-model-has-not-settled). A command minting node ids against an
unsettled store would be deciding that contract rather than driving it, and the deciding would
happen in the package furthest from where the contract lives.
