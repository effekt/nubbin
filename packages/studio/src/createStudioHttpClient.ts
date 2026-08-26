import { parseDraftHttpReply } from "./parseDraftHttpReply";
import { parseHistoryHttpReply } from "./parseHistoryHttpReply";
import { parseRouteCreateHttpReply } from "./parseRouteCreateHttpReply";
import { postHttpJson } from "./postHttpJson";
import { publishOutcomeFromResponse } from "./publishOutcomeFromResponse";
import type { StudioHttpClient } from "./studioHttpClient.types";
import type { StudioHttpClientOptions } from "./studioHttpClientOptions.types";

const CONFLICT = 409;

/** Builds the browser transport for either a same-origin Studio or a separately hosted one.
 * Authentication remains host-owned: pass a fetch wrapper that adds the desired credentials. */
export function createStudioHttpClient(options: StudioHttpClientOptions = {}): StudioHttpClient {
  const request =
    options.fetch ??
    ((input: RequestInfo | URL, init?: RequestInit) => globalThis.fetch(input, init));
  const baseUrl = (options.baseUrl ?? "").replace(/\/$/, "");
  return {
    async createRoute(route) {
      const response = await postHttpJson(request, `${baseUrl}/api/routes`, { route });
      return parseRouteCreateHttpReply(response.ok, response.status, await response.text());
    },
    async saveDraft(save) {
      const response = await postHttpJson(request, `${baseUrl}/api/draft`, save);
      if (!response.ok) {
        const text = await response.text();
        if (response.status !== CONFLICT) {
          throw new Error(text === "" ? `save rejected (${response.status})` : text);
        }
      }
      return parseDraftHttpReply(await response.json().catch(() => undefined));
    },
    async publish(route) {
      const response = await request(`${baseUrl}/api/publish`, {
        method: "POST",
        headers: { accept: "application/json" },
        body: new URLSearchParams({ route }),
      });
      return publishOutcomeFromResponse(route, response);
    },
    async rollback(route, hash) {
      const response = await postHttpJson(request, `${baseUrl}/api/rollback`, { route, hash });
      return publishOutcomeFromResponse(route, response);
    },
    async history(route) {
      const suffix = route === "/" ? "" : route;
      const response = await request(`${baseUrl}/api/history${suffix}`).catch(() => undefined);
      if (response === undefined || !response.ok) return undefined;
      return parseHistoryHttpReply(await response.text());
    },
  };
}
