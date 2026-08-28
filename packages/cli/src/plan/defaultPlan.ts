import type { Plan } from "./plan.types";

/**
 * The plan a questionnaire starts from: every service self-hosted, on a public network, read at
 * build time.
 *
 * Self-hosting is the default because it is the answer that needs no agreement with anyone — a
 * questionnaire opening on a hosted service would be a sales page wearing a form.
 */
export const defaultPlan: Plan = {
  framework: "next",
  components: "existing",
  studio: "self",
  drafts: "self",
  publishing: "self",
  artifacts: "self",
  delivery: "self",
  consumption: "build",
  notifications: [],
  assets: "self",
  operations: "self",
  network: "public",
};
