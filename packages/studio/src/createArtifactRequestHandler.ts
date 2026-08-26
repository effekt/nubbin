import type { ArtifactRequestHandlerOptions } from "./artifactRequestHandlerOptions.types";
import { loadRoutedValue } from "./loadRoutedValue";
import { noDraftResponse } from "./noDraftResponse";

const NOT_FOUND = 404;
const JSON_INDENT = 2;

/** Creates an artifact download endpoint while leaving route conventions, compilation, and access control to the host. */
export function createArtifactRequestHandler<Context>(
  options: ArtifactRequestHandlerOptions<Context>,
) {
  return async (_request: Request, context: Context): Promise<Response> => {
    const { route, value: artifact } = await loadRoutedValue(options, context);
    if (artifact === undefined) {
      return noDraftResponse(route, NOT_FOUND);
    }
    return new Response(JSON.stringify(artifact, null, JSON_INDENT), {
      headers: {
        "content-type": "application/json",
        "content-disposition": `attachment; filename="${artifact.documentId}-${artifact.hash}.json"`,
      },
    });
  };
}
