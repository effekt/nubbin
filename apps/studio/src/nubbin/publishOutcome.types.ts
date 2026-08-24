/**
 * What a publish attempt came back as. `ok` carries the hash the route now serves when the
 * followed redirect named one; a refusal carries the issues still raw off the wire — the
 * editor translates them with the catalog and draft it alone holds.
 */
export type PublishOutcome =
  | { readonly ok: true; readonly route: string; readonly hash?: string }
  | { readonly ok: false; readonly issues: readonly unknown[] };
