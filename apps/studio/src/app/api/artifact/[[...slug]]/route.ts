import { routeFromSlug } from "@nubbin/next";
import { createArtifactRequestHandler } from "@nubbin/studio";
import { compileDraft } from "../../../../nubbin/compileDraft";

/** The slice's other publish path: the compiled artifact itself, as a file the caller can
 * carry to any store. */
export const GET = createArtifactRequestHandler<{ params: Promise<{ slug?: string[] }> }>({
  route: async ({ params }) => routeFromSlug((await params).slug),
  load: compileDraft,
});
