/**
 * The origin of the application the studio publishes into — the one seam for that address:
 * pointer moves run against it, because `revalidatePath` reaches only the cache of the
 * process that runs it, and the publish response builds the live page's URL from it, so no
 * client holds a second copy. Part of the consumer binding: a consumer pointing the studio
 * at their own app sets `NUBBIN_CONSUMER_ORIGIN`; the default is the demo's dev address.
 */
export function consumerOrigin(): string {
  return process.env.NUBBIN_CONSUMER_ORIGIN ?? "http://localhost:3000";
}
