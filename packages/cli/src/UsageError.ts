/**
 * A refusal the caller fixes by running a different command — a missing config, a route with no
 * document, an argument that is not there. Kept apart from `NubbinError`, which is the library
 * refusing a document, because the two exit differently: a usage error means nothing was
 * attempted, and a refusal means the thing attempted is not legal.
 */
export class UsageError extends Error {
  /**
   * Lines printed beneath the message, each as given. Usually none; a plan file the schema
   * refuses carries one per issue, because one line naming the file and the first problem would
   * send a person back for each of the others.
   */
  readonly details: readonly string[];

  constructor(message: string, details: readonly string[] = []) {
    super(message);
    this.name = "UsageError";
    this.details = details;
  }
}
