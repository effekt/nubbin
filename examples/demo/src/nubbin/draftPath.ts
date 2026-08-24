import { join } from "node:path";

/**
 * Where a route's draft lives: one JSON file per route, in a gitignored directory beside the
 * store — beside rather than inside, because the store holds compiled, content-addressed
 * artifacts and a draft is neither. The route is URI-encoded so its slashes cannot become
 * directories.
 */
export const draftPath = (route: string): string =>
  join(process.cwd(), ".nubbin-drafts", `${encodeURIComponent(route)}.json`);
