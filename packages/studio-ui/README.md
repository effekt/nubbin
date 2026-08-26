# @nubbin/studio-ui

The optional React editor layer for Nubbin Studio. It contains the controlled editor engine,
Puck adapter, editor hooks, configuration helper, and browser-side context used by the visual
editor.

Install it when you want Nubbin's provided editor interface:

```bash
pnpm add @nubbin/studio @nubbin/studio-ui
```

Applications that build their own editor can depend on `@nubbin/studio` alone. That headless
package supplies transports, request handlers, projections, and publishing contracts without
React or Puck.

Import `defineStudioConfig` through the server-safe configuration entry:

```ts
import { defineStudioConfig } from "@nubbin/studio-ui/config";
```

The default entry is a client module and exports the React hooks and Puck adapter. The consuming
application continues to own its host framework, routing, authentication, and storage.

`StudioEditor` owns draft folding, debounced saves, issue projection, publish outcomes, and Puck's
controlled state. Its `presentation` contract lets the supplied Nubbin chrome—or a custom editor—
compose around that lifecycle without replacing it. MIT.
