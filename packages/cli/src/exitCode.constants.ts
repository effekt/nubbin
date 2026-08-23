/**
 * What the process leaves behind. Three, because a caller scripting this needs to tell "the
 * command was wrong" from "the document was" — a build step retries neither, but a person fixes
 * them in different files.
 */
export const ExitCode = {
  /** It happened. Warnings may still have been printed. */
  Done: 0,
  /** Nubbin refused: the document, the rollback, or something already live. */
  Refused: 1,
  /** The command could not be run as given: no config, no route, no such command. */
  Usage: 2,
} as const;
