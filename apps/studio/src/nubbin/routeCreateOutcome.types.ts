/**
 * What a create-route attempt came back as. `ok` carries the route the editor should
 * navigate to; a refusal carries one readable message — the compiler's own words for a
 * malformed route, or the conflict line for one that already exists.
 */
export type RouteCreateOutcome =
  | { readonly ok: true; readonly route: string }
  | { readonly ok: false; readonly message: string };
