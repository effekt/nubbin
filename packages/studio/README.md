# @nubbin/studio

The headless contracts and operations for a self-hosted Nubbin Studio. It supplies editor
projections, HTTP transports, request handlers, status state, and publish operations without
depending on React, Puck, or a host framework.

`createStudioHttpClient()` supplies the draft, route, publish, history, and rollback transport.
It defaults to same-origin endpoints. Pass `baseUrl` for a separately hosted Studio, or a wrapped
`fetch` to attach the host's credentials, authorization headers, tracing, and retry policy.
Draft saves carry an opaque expected revision. Studio retains the shared base locally. A host
atomically compares the revision and returns either the next revision or its current draft;
transport and storage choices do not change the conflict contract.

```bash
npm install @nubbin/studio
```

Use this package alone to build a custom interface. Install `@nubbin/studio-ui` when you want
Nubbin's supplied React editor layer. The application hosting Studio owns whether and how to
add authentication and authorization, plus networking, storage, and deployment. Nubbin owns
the editor contract and compile-and-publish behavior. MIT.

## Prove a draft host

Import the executable contract from the optional testing entry in a Vitest file. The factory
returns fresh host state for every case; Nubbin does not need to know where that state lives.

```ts
import { runDraftSaveContract } from "@nubbin/studio/testing";

runDraftSaveContract("postgres", async () => {
  const seeded = await seedDraft();
  return {
    saveDraft,
    route: seeded.route,
    missingRoute: "/not-held",
    version: seeded.version,
    revision: seeded.revision,
  };
});
```

The suite checks revision chaining, stale-write refusal, missing-document outcomes, and atomic
competition between two writers. It tests the behavior of the callback, not its database,
transport, identity model, or deployment.
