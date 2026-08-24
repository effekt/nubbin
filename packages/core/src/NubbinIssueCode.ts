// A const object rather than a TypeScript `enum`: it yields the same two things — a value to
// branch on and a type to check against — without the runtime object an `enum` emits, and `core`
// has to run unchanged in a browser, a worker and a build step.
//
// Closed on purpose. A new refusal is a new member here, which is what makes the reference page
// listing them checkable against this file.
/**
 * Every reason Nubbin refuses something, as a value to branch on rather than a string to match.
 * Compare it against `NubbinIssue.code` or `NubbinError.code`; a typo in a member name is a
 * compile error, where a typo in a string literal is a branch that never runs.
 *
 * Each member's value is its own name in kebab-case, so a serialized issue reads the same in a
 * log as it does in code. Scripts and editors match on these names, so every member below says
 * what raises it and what has to change to satisfy it.
 *
 * @example
 * ```ts
 * import { NubbinError, NubbinIssueCode } from "@nubbin/core";
 *
 * try {
 *   addNode(version, "section-1", "items", node);
 * } catch (error) {
 *   if (error instanceof NubbinError && error.code === NubbinIssueCode.SlotMax) {
 *     toast(`That slot is full: ${error.issues[0]?.at}`);
 *   }
 * }
 * ```
 */
export const NubbinIssueCode = {
  // Registration — a block, catalog or registry the developer wrote cannot be used as written.

  /** `defineBlock` was given a `version` that is not an integer of 1 or more. */
  BlockVersion: "block-version",
  /** `defineBlock` was given a slot whose `min` is above its `max`, which no composition satisfies. */
  SlotBounds: "slot-bounds",
  /** `createRegistry` found a slot's `allow` naming a block no registered block answers to. */
  SlotAllowUnknown: "slot-allow-unknown",
  /** `createRegistry` was given two blocks claiming one name — the identity every node resolves through. */
  DuplicateBlockName: "duplicate-block-name",
  /** `defineCatalog` found an entry's `defaults` do not satisfy that entry's own schema. */
  InvalidDefaults: "invalid-defaults",
  /** `defineCatalog` found `ui.fields` naming a path the schema does not define. Check the spelling against the schema. */
  HintPathUnresolvable: "hint-path-unresolvable",
  /**
   * `defineCatalog` found a `data` hint with no single target: a path through `[]`, which names
   * every member of an array, or two hints whose paths nest and would write one value twice.
   */
  HintNotAddressable: "hint-not-addressable",

  // Schema — what the consumer brought does not answer the one door core reads a schema through.

  /**
   * A schema exposes no `~standard.validate`, or answers with a promise. Validation is
   * synchronous at registration and at compile, so an async validator is refused rather than
   * awaited.
   */
  NotStandardSchema: "not-standard-schema",
  /**
   * A schema exposes no Standard JSON Schema converter, which field introspection needs — the
   * studio reads a block's fields through it.
   */
  NoJsonSchema: "no-json-schema",

  // Structure — the document's graph cannot become a tree.

  /** The document's `roots` is empty, so it names no entry element and there is no tree to build. */
  NoRoots: "no-roots",
  /**
   * A node names a block neither the registry nor the catalog holds. Register the block, or
   * correct the node's `block`.
   */
  UnknownBlock: "unknown-block",
  /** A slot or a `roots` entry references an id that `elements` does not hold. */
  DanglingChild: "dangling-child",
  /** A node reaches back to one of its own ancestors, so the graph cannot flatten into a tree. */
  Cycle: "cycle",
  /** No slot reaches the node from any root, so it would be dropped silently on compile. */
  Unreachable: "unreachable",
  /** A slot the block never declared, or a child the slot's `allow` list rejects. */
  SlotNotAllowed: "slot-not-allowed",
  /** A slot holds fewer children than its `min`. An omitted slot holds zero. */
  SlotMin: "slot-min",
  /** A slot holds more children than its `max`. */
  SlotMax: "slot-max",

  // Props — the values a node carries, judged against the block's schema.

  /**
   * A node's props failed its schema, or parsed to something other than an object. `path` names
   * the offending field.
   */
  InvalidProps: "invalid-props",
  /**
   * A key the author wrote and the schema did not keep — almost always a typo, `heading` where
   * the schema says `headline`. **Returned in `CompileResult.issues`, never thrown:** the
   * artifact is valid and publishable without that key.
   */
  UnknownProp: "unknown-prop",

  // Document operations — the caller named something the document does not hold.

  /** `setNodeProp`, `addNode`, `removeNode` or `moveNode` named a node id no element backs. */
  NoSuchNode: "no-such-node",
  /**
   * `addNode` was given an id the document already uses. Reusing one would replace a node and
   * redirect every slot that named it.
   */
  DuplicateNodeId: "duplicate-node-id",
  /**
   * A prop path with no single target: an empty segment, an `[]`, or a descent into an array.
   * Raised by `setAtPath` and by `setNodeProp`.
   */
  PathNotAddressable: "path-not-addressable",
  /**
   * A route no request could match — no leading slash, a trailing slash, an empty or malformed
   * segment, or a `*` that is not the last one. Raised by `compile` and by `parseMatchKind`.
   */
  InvalidRoute: "invalid-route",

  // Render — the artifact and the registry serving it disagree.

  /** `@nubbin/react`: the block registry has no importer for a block the artifact names. */
  BlockNotLoaded: "block-not-loaded",
  /** `@nubbin/react`: a node declares holes and the render was given no `resolveHole`. */
  NoHoleResolver: "no-hole-resolver",
  /** `@nubbin/react`: a block returned a Fragment, a composite, or several roots where one host element is required. */
  NotOneHostElement: "not-one-host-element",

  // Store — a write the store cannot honour.

  /** A publish names a hash the store does not hold. Write the artifact before pointing a route at it. */
  ArtifactNotStored: "artifact-not-stored",
} as const;

/** The value of any member, for a consumer narrowing on `issue.code`. */
export type NubbinIssueCode = (typeof NubbinIssueCode)[keyof typeof NubbinIssueCode];
