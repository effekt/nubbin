const DEFAULT_DEMO_ORIGIN = "http://localhost:3000";

/**
 * The demo's live page for a route — where a just-published artifact is actually served,
 * which is the other Next app running beside this studio. `NEXT_PUBLIC_DEMO_ORIGIN` is the
 * seam a consumer sets when their site serves from anywhere else; the default is the port
 * the demo's own dev script binds.
 */
export function demoPageUrl(route: string): string {
  return `${process.env.NEXT_PUBLIC_DEMO_ORIGIN ?? DEFAULT_DEMO_ORIGIN}${route}`;
}
