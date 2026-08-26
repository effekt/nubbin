---
title: Draft saves reconcile from a shared base
summary: A stale writer receives the current draft and merges both descendants before another save
status: stable
---

# Draft saves reconcile from a shared base

An editor can remain open while another tab, device, person or agent saves the same document.
Accepting both whole-document writes would let the later request erase valid work without knowing
it. Presence and locks reduce that race but cannot prevent it: clients disconnect, leases expire,
and a writer may save from an old revision after reconnecting.

Every draft read carries an opaque revision. A save names the revision its working copy descends
from, and the host compares that revision atomically with the current one. A match saves the draft
and returns its next revision. A mismatch returns the current draft and revision without writing.

Studio reconciles the shared base, the local working copy and the returned remote draft. Changes
made on only one side merge automatically. Equal changes made on both sides merge once. Different
changes to the same value remain explicit conflicts carrying the base, local and remote values.
The editor keeps the local working copy until every conflict is resolved, then retries against the
returned revision. A transport may announce revisions, presence and leases sooner; HTTP save
outcomes remain the correctness boundary.

Last-write-wins was rejected because it silently discards the earlier writer's work. Mandatory
node locks were rejected as the correctness boundary because an unavailable or partitioned client
cannot release one reliably. A CRDT was rejected as the required document model because the
authoring shape can reconcile ordinary concurrent edits without coupling every host to a sync
engine; a host may still implement the same save and realtime contracts with one.
