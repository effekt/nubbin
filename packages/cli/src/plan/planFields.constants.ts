/**
 * Every field of a plan, in schema order, with the values it accepts.
 *
 * The order is load-bearing: `encodePlan` writes one character per key in this order, so moving a
 * key invalidates every code already issued. Deriving the schema, the encoding and the enumeration
 * test from one table is what stops the three from disagreeing — a second list of the same enums
 * beside the schema is the copy that goes stale.
 */
export const PLAN_FIELDS = {
  framework: ["next", "react", "other"],
  components: ["existing", "starter"],
  studio: ["self", "nubbin"],
  drafts: ["self", "nubbin"],
  publishing: ["self", "nubbin"],
  artifacts: ["self", "nubbin"],
  delivery: ["self", "nubbin"],
  consumption: ["build", "on-change", "runtime"],
  notifications: ["webhook", "deploy", "workflow"],
  assets: ["self", "nubbin"],
  operations: ["self", "nubbin"],
  network: ["public", "private", "isolated"],
} as const;
