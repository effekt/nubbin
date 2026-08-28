/** Who runs Studio and where drafts live, keyed by `studio`-`drafts`. */
export const AUTHORING = {
  "self-self": "You run Studio and keep drafts on your own infrastructure.",
  "self-nubbin": "You run Studio and Nubbin keeps your drafts.",
  "nubbin-self": "Nubbin runs Studio and you keep drafts on your own infrastructure.",
  "nubbin-nubbin": "Nubbin runs Studio and keeps your drafts.",
} as const;

/** Where artifacts live and who serves them, keyed by `artifacts`-`delivery`. */
export const PUBLISHED = {
  "self-self": "You store and serve published artifacts yourself",
  "self-nubbin": "You store published artifacts and Nubbin serves them",
  "nubbin-self": "Nubbin stores published artifacts and your application serves them",
  "nubbin-nubbin": "Nubbin stores and serves published artifacts",
} as const;

/** When the application reads an artifact, keyed by `consumption`. */
export const READING = {
  build: "at build time",
  "on-change": "when they change",
  runtime: "on every request",
} as const;
