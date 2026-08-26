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

The optional `StudioToolbar`, `PublishControl`, `OutcomeNotice`, and `StudioStatusBar` components
provide Nubbin's default editor chrome, publishing workflow, and feedback. Import their stylesheet
once in the host application:

```tsx
import "@nubbin/studio-ui/styles.css";
import {
  OutcomeNotice,
  PublishControl,
  StudioStatusBar,
  StudioToolbar,
} from "@nubbin/studio-ui";
```

`PublishControl` accepts the active route, a headless `StudioOperations` client, and an outcome
callback. It owns publish, history, rollback, and restore presentation without knowing the host
application or its authentication model.

`StudioToolbar` owns Puck's sidebar, history, and viewport controls. The host supplies navigation,
document identity, configured viewports, and right-edge actions as composable slots, so URL and
routing policy remain outside the package.

`ToolbarDocument` supplies the default document-identity slot. It reads the current draft title
from Puck, resolves the live address through `ConsumerOriginContext`, and accepts the host's route-
derived fallback title.

`RouteSwitcher` provides the default navigation slot. Its route-link builder, create operation, and
post-create navigation callback are injected, keeping framework routing and deployment prefixes in
the host while retaining Nubbin's accessible page list and creation flow.

`BlockPalette` provides the searchable, grouped block drawer, keyboard insertion, contextual help,
and hover previews. The host injects the preview URL builder, so the package owns the editor
experience without assuming a framework route or deployment prefix.

`StudioOutline` provides the recursive page tree, slot fullness, folding, selection, and palette
icons. It accepts the registry-derived icon and slot maps, keeping the visual tree independent of
the host application's catalog location.

`IssuesPill` provides publish-blocking issue presentation and navigation. It selects the affected
block and resolves nested field paths—including collapsed repeater rows—without requiring the host
to understand Puck's generated field identifiers.

`FieldsWithCallout` packages the inspector shell: selected-block identity and position, optional
documentation links, issue summaries, page guidance, and autosave reassurance around the host's
field controls.

The packaged scalar field controls cover plain and bounded text, links, numbers, booleans, enums,
segmented choices, and read-only fallbacks. `ScalarFieldControl` dispatches from Nubbin's described
field contract, so hosts do not need to rebuild the default control-selection rules.

The same package owns Nubbin's structured controls. `RepeaterField`, `FieldsetGroup`, and
`RichTextField` render nested object and array schemas, reorderable rows, and Nubbin's constrained
rich-text document without exposing arbitrary HTML or JavaScript. `SubFieldControl` recursively
dispatches nested fields through those controls, while `toHintedFields` folds catalog UI hints onto
the schema description before a host builds its editor configuration.

Consumers that supply their own presentation do not need the stylesheet or these components.

`StudioEditor` owns draft folding, debounced saves, issue projection, publish outcomes, and Puck's
controlled state. Its `presentation` contract lets the supplied Nubbin chrome—or a custom editor—
compose around that lifecycle without replacing it. MIT.
