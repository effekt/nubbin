import { NubbinError } from "@nubbin/core";

/** Maps expected Nubbin refusals while allowing host infrastructure failures to escape. */
export async function respondToNubbinError(
  operation: () => Response | Promise<Response>,
  refusal: (error: NubbinError) => Response,
): Promise<Response> {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof NubbinError) return refusal(error);
    throw error;
  }
}
