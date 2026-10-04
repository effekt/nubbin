import type { Plan } from "./plan/plan.types";

/**
 * The three stages a `nubbin.config.ts` configures, in plan-field order: `document` and `save`
 * read and write drafts, the terminal publish path exists only where publishing is the
 * customer's, and `store` names where artifacts go.
 */
const PUBLISH_PATH_FIELDS = [
  "drafts",
  "publishing",
  "artifacts",
] as const satisfies readonly (keyof Plan)[];

/** One of the three stages a config can wire. */
export type PublishPathField = (typeof PUBLISH_PATH_FIELDS)[number];

/**
 * The first stage of the publish path a plan hands to Nubbin, or `null` where the customer runs
 * all three. No package here implements a Nubbin-run stage — the repository ships contracts, not
 * operated infrastructure — so a config pointing at one would not typecheck, and `init` writes
 * nothing rather than writing that.
 */
export function hostedPublishField(plan: Plan): PublishPathField | null {
  return PUBLISH_PATH_FIELDS.find((field) => plan[field] === "nubbin") ?? null;
}
