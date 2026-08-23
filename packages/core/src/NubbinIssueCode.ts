/**
 * Every reason Nubbin refuses something, as a value a consumer can key off rather than a string
 * they have to match. Each member's value is its own name in kebab-case, so a serialized issue
 * reads the same in a log as it does in code.
 *
 * A const object rather than a TypeScript `enum`: it yields the same two things — a value to
 * branch on and a type to check against — without the runtime object an `enum` emits, and `core`
 * has to run unchanged in a browser, a worker and a build step.
 *
 * Closed on purpose. A new refusal is a new member here, which is what makes the reference page
 * listing them checkable against this file.
 */
export const NubbinIssueCode = {
  // Registration — a block, catalog or registry the developer wrote cannot be used as written.
  BlockVersion: "block-version",
  SlotBounds: "slot-bounds",
  SlotAllowUnknown: "slot-allow-unknown",
  DuplicateBlockName: "duplicate-block-name",
  InvalidDefaults: "invalid-defaults",
  HintPathUnresolvable: "hint-path-unresolvable",
  HintNotAddressable: "hint-not-addressable",

  // Schema — what the consumer brought does not answer the one door core reads a schema through.
  NotStandardSchema: "not-standard-schema",
  NoJsonSchema: "no-json-schema",

  // Structure — the document's graph cannot become a tree.
  NoRoots: "no-roots",
  UnknownBlock: "unknown-block",
  DanglingChild: "dangling-child",
  Cycle: "cycle",
  Unreachable: "unreachable",
  SlotNotAllowed: "slot-not-allowed",
  SlotMin: "slot-min",
  SlotMax: "slot-max",

  // Props — the values a node carries, judged against the block's schema.
  InvalidProps: "invalid-props",
  UnknownProp: "unknown-prop",

  // Document operations — the caller named something the document does not hold.
  NoSuchNode: "no-such-node",
  DuplicateNodeId: "duplicate-node-id",
  PathNotAddressable: "path-not-addressable",
  InvalidRoute: "invalid-route",

  // Render — the artifact and the registry serving it disagree.
  BlockNotLoaded: "block-not-loaded",
  NoHoleResolver: "no-hole-resolver",
  NotOneHostElement: "not-one-host-element",

  // Store — a write the store cannot honour.
  ArtifactNotStored: "artifact-not-stored",
} as const;

/** The value of any member, for a consumer narrowing on `issue.code`. */
export type NubbinIssueCode = (typeof NubbinIssueCode)[keyof typeof NubbinIssueCode];
