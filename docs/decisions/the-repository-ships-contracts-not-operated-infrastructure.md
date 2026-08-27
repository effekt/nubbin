---
title: "The repository ships contracts, not operated infrastructure"
summary: Why every external effect belongs to an injected host implementation
status: stable
---

# The repository ships contracts, not operated infrastructure

Nubbin must edit, validate, compile, render, and publish without choosing where a consumer
stores data or whether and how a deployment identifies a caller. Those choices belong to the
application and change independently of the document model.

The repository therefore owns the contracts, pure behavior, command-line tools, and complete
editor surfaces. External effects enter through injected functions or adapter interfaces.
The host owns persistence, any caller identity or authorization it chooses, networking,
secrets, deployment topology, assets, telemetry destinations, and collaboration
infrastructure. Reference adapters prove a contract and may be replaced without changing
Nubbin's behavior.

This boundary also applies to realtime editing. Nubbin may expose document and editor events, but a host decides whether to send them through polling, Server-Sent Events, WebSockets, a synchronization engine, or no shared session at all. A separately operated service can implement the same public boundary without becoming a prerequisite for the packages in this repository.

An integrated backend was rejected because it would turn storage, identity, and transport
choices into Nubbin requirements. Leaving required effects implicit was also rejected: a
usable editor needs explicit callbacks so every save, publish, and navigation action has a
destination the host controls. The host may implement the save callback by overwriting one
file; an append-only database is not assumed.
