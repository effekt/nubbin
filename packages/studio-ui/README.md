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

The optional `PublishControl`, `OutcomeNotice`, and `StudioStatusBar` components provide Nubbin's
default publishing workflow and feedback. Import their stylesheet once in the host application:

```tsx
import "@nubbin/studio-ui/styles.css";
import { OutcomeNotice, PublishControl, StudioStatusBar } from "@nubbin/studio-ui";
```

`PublishControl` accepts the active route, a headless `StudioOperations` client, and an outcome
callback. It owns publish, history, rollback, and restore presentation without knowing the host
application or its authentication model.

Consumers that supply their own presentation do not need the stylesheet or these components.

`StudioEditor` owns draft folding, debounced saves, issue projection, publish outcomes, and Puck's
controlled state. Its `presentation` contract lets the supplied Nubbin chrome—or a custom editor—
compose around that lifecycle without replacing it. MIT.
