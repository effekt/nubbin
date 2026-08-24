# Studio

The editor. It reads a catalog, edits a draft through a palette and an inspector, previews the
result through the consumer's own renderer, and publishes by moving a route pointer.

Run it against the demo:

```bash
pnpm --filter studio dev     # http://localhost:3001
pnpm --filter demo dev       # http://localhost:3000 — serves what the studio publishes
```

Everything else — what saves when, which prop kinds the inspector edits, and the seam a
consumer replaces to point this at their own application — is documented at
[Running the Studio](https://effekt.github.io/nubbin/reference/editing/studio), written from
`docs/reference/editing/studio.md`.
