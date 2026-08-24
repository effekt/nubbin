/**
 * How long each of a publish's three steps took, in milliseconds, measured by the endpoint
 * around the work itself — the client renders them as the publish report's checked steps
 * rather than inventing durations it never saw.
 */
export interface PublishTimings {
  /** Compiling the draft — the validation gate. */
  readonly compileMs: number;
  /** Writing the artifact into the store. */
  readonly writeMs: number;
  /** Moving the route's pointer through the consumer's origin. */
  readonly moveMs: number;
}
