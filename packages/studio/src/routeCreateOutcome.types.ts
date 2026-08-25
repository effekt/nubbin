/** The result of asking a Studio host to create an editable route. */
export type RouteCreateOutcome =
  | { readonly ok: true; readonly route: string }
  | { readonly ok: false; readonly message: string };
