/**
 * The origin of the application the studio publishes into, for calls that must run inside
 * that application's serving process — pointer moves, whose `revalidatePath` reaches only
 * the cache of the process that runs it. Part of the consumer binding: a consumer pointing
 * the studio at their own app sets `NUBBIN_CONSUMER_ORIGIN`; the default is the demo's dev
 * address.
 */
export function consumerOrigin(): string {
  return process.env.NUBBIN_CONSUMER_ORIGIN ?? "http://localhost:3000";
}
