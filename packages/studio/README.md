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
