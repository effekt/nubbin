/**
 * The one label vocabulary the diagram and the ownership split share.
 *
 * One table rather than a literal at each use site: a diagram naming a box "Artifact store" beside
 * an ownership list naming the same thing "Artifacts" reads as two systems.
 */
export const PLAN_LABELS = {
  application: "Application",
  components: "Components",
  studio: "Studio",
  drafts: "Draft storage",
  publishing: "Publishing",
  artifacts: "Artifact store",
  delivery: "Delivery",
  assets: "Assets",
  operations: "Operations",
} as const;
