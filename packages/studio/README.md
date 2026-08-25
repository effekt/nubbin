# @nubbin/studio

The public configuration contract for a self-hosted Nubbin Studio. It binds the editor to the
catalog, registries, documents, live-data resolver, canvas widths, storage, and origin owned by
the application being edited.

```bash
npm install @nubbin/studio
```

```ts
import { defineStudioConfig } from "@nubbin/studio";

export default defineStudioConfig({
  catalog,
  registry,
  blockRegistry,
  seedDocuments,
  resolveHole,
  viewports,
  artifactStoreDir: ".nubbin",
  consumerOrigin: "http://localhost:3000",
});
```

The application hosting Studio owns authentication, authorization, networking, and storage.
Nubbin owns the editor contract and the compile-and-publish behavior behind it. MIT.
