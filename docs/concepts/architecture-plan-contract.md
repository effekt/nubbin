---
title: Architecture Plan
summary: The twelve-field plan a questionnaire, the CLI and a portal all produce, its code, and what is derived from it
status: draft
---

# Architecture plan

An architecture plan says which parts of the publishing path a customer runs and which parts
Nubbin supplies. A questionnaire on the website produces one, a terminal argument carries one, and
a portal record stores one — three interfaces reading a single decision model, rather than three
wizards that agree until the day one of them changes.

The object is a contract rather than an internal shape. `@nubbin/cli/plan` publishes it, and
everything anybody sees from it — a system picture, an ownership split, an install line, a price
bracket — is a pure function of the twelve answers below.

## The plan

| Field | Values | Answers |
|---|---|---|
| `framework` | `next`, `react`, `other` | Which binding the application renders through |
| `components` | `existing`, `starter` | Whether there is a design system to register, or blocks to copy |
| `studio` | `self`, `nubbin` | Who runs the editing canvas |
| `drafts` | `self`, `nubbin` | Where a composition sits before it is published |
| `publishing` | `self`, `nubbin` | Who runs the compile that turns a draft into an artifact |
| `artifacts` | `self`, `nubbin` | Where a published artifact is kept |
| `delivery` | `self`, `nubbin` | Who answers a request for one |
| `consumption` | `build`, `on-change`, `runtime` | When the application reads an artifact |
| `notifications` | any of `webhook`, `deploy`, `workflow` | How a publish reaches the customer's other systems |
| `assets` | `self`, `nubbin` | Where an image an author uploads is kept |
| `operations` | `self`, `nubbin` | Who is paged when something the customer owns breaks |
| `network` | `public`, `private`, `isolated` | What the customer's infrastructure is allowed to reach |

Closed enums throughout, chosen over an open configuration object. A closed field has a countable
set of combinations, which is what makes the identity below a code rather than a document, and
what lets a rule about two answers be stated in a line instead of validated in a form.

The schema is hand-written against Standard Schema rather than built from a validator, which is
the same trade `core` makes: the browser bundle that imports this carries no parser to check
twelve memberships, and installing the command line does not install a validator with it.

`framework` and `components` are answers about the customer's codebase rather than about
topology, and they earn their place by changing what is installed and what the first step says.
Detecting either of them is behaviour a command can have over a plan, not a field of one.

## Identity

A plan encodes to `v1-` and one character per field, in the order of the table above. An enum
field spends a character naming the position of its answer — `a` for the first value a field
declares, `b` for the second. `notifications` spends one character per option, `1` where the plan
carries it and `0` where it does not.

The default plan is every service self-hosted, on a public network, read at build time:

```text
v1-aaaaaaaa000aaa
```

Reading it back is the same walk in reverse, and a code that cannot be read comes back as `null`
rather than as a throw — a wrong prefix, a wrong length, or a character addressing a value no
field declares. Codes arrive from a stranger's address bar, so the refusal is a value every caller
has to handle instead of an exception any of them can forget.

A reversible code beat a content hash. A hash is shorter and fixed-width whatever the plan grows
into, but inverting one takes a lookup table, and the parties that read a code share no storage to
put one in. A code that is its own table needs no agreement between them.

## Consistency

Three combinations satisfy the schema and cannot be delivered. Each is reported against the field
a customer would change to resolve it.

| Combination | Reported against | Message |
|---|---|---|
| `delivery: nubbin` with `artifacts: self` | `artifacts` | Nubbin can only serve artifacts it stores. |
| `consumption: on-change` with no notification | `notifications` | Reacting to a change needs a notification to react to. |
| `network: isolated` with any Nubbin-run service | each such field | An isolated network reaches no Nubbin service. |

Paying Nubbin to run infrastructure the customer owns raises none of them: `operations: nubbin`
with every service self-hosted is an arrangement the product supports, and refusing it would
refuse the customers most likely to be reading.

These rules live beside the schema rather than inside the questionnaire that collects the answers.
A rule held by one interface is a rule the other two work out again, and working it out again is
where two of the three end up refusing different things.

## Projections

Every derived fact is a pure function of the plan. A drawing, a terminal listing and a portal card
render what these return; none of them holds a rule of its own.

`deriveDiagram` returns a `Diagram` — nodes carrying an owner and a stage, and the edges between
them. A model beat an image: the same plan has to appear as a branded picture on a website and as
plain text in a terminal, and a picture produced here would carry one surface's styling into the
other.

`deriveOwnership` returns two lists of labels, one per party. The application and its components
stay with the customer whatever else is hosted — they are the two things Nubbin taking over would
turn it into [the hosted service this repository refuses to become](../decisions/the-repository-ships-contracts-not-operated-infrastructure.md).

`derivePackages` returns a `PackageRef` for each package, marked as a runtime or a development
dependency. Refs beat a ready-made install command: a page rendering the packages as a list would
have to take a command back apart to get them, while the command is one join away from the refs.

`deriveSteps` returns at most eight `Step`s — install, register the components, then one per stage
the customer runs something in, then one per notification. Capped rather than exhaustive, because
a plan owning every stage and taking every notification produces a list nobody reaches the end of.

`deriveEligibility` returns `free`, `paid` or `contact`. Ownership decides it: any Nubbin-run
service makes a plan paid, and anything off a public network is a conversation, as is operating
infrastructure the customer owns. Ownership beat a price table, which would have to be written
before the first customer and rewritten after them, while the ownership rule holds either way.

`describePlan` returns two sentences — who runs the editor and where drafts sit, then where
artifacts are kept, who serves them, and when the application reads them. The sentences come from
a table of clauses rather than being assembled a word at a time, because the four ownership
combinations do not share a grammar: one of them drops a pronoun the other three need.

## Where it is consumed

`@nubbin/cli/plan` is a second entry point on the package the terminal already ships. Nothing
behind it imports a Node builtin or the config loader, so a browser bundle carries it whole: the
questionnaire runs the schema, the code and the projections that the publish path runs, rather
than a copy of them written for the web.

The terminal is the second consumer, and the reason the contract lives in this package rather than
in the website's repository. A command handed a code has to read it under the rules the
questionnaire wrote it under, and a decision model held only by the website is one the terminal
would derive again from the same document — the outcome the single model exists to prevent.

A subpath export beat widening the root entry. The root is what a `nubbin.config.ts` imports, and
that file is loaded under Node through a TypeScript loader; folding the browser-safe surface into
it would invite a configuration helper into a browser bundle and hide the mistake until somebody
built one. A separate package was the other candidate — one more thing to version, check and
release, for a surface whose consumers both depend on the command line already.

[How it works](architecture.md) covers the pipeline the plan describes ownership of.
