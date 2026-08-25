import { parseDraftHttpReply } from "./parseDraftHttpReply";
import { parseHistoryHttpReply } from "./parseHistoryHttpReply";
import { parsePublishHttpReply } from "./parsePublishHttpReply";
import type { StudioHttpClient } from "./studioHttpClient.types";
import type { StudioHttpClientOptions } from "./studioHttpClientOptions.types";

/** Builds the browser transport for either a same-origin Studio or a separately hosted one.
 * Authentication remains host-owned: pass a fetch wrapper that adds the desired credentials. */
export function createStudioHttpClient(options: StudioHttpClientOptions = {}): StudioHttpClient {
  const request =
    options.fetch ??
    ((input: RequestInfo | URL, init?: RequestInit) => globalThis.fetch(input, init));
  const baseUrl = (options.baseUrl ?? "").replace(/\/$/, "");
  return {
    async saveDraft(route, version) {
      const response = await request(`${baseUrl}/api/draft`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ route, version }),
      });
      if (!response.ok) {
        const text = await response.text();
        return [{ message: text === "" ? `save rejected (${response.status})` : text }];
      }
      return parseDraftHttpReply(await response.json().catch(() => undefined));
    },
    async publish(route) {
      const response = await request(`${baseUrl}/api/publish`, {
        method: "POST",
        headers: { accept: "application/json" },
        body: new URLSearchParams({ route }),
      });
      return parsePublishHttpReply(route, response, await response.text());
    },
    async rollback(route, hash) {
      const response = await request(`${baseUrl}/api/rollback`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ route, hash }),
      });
      return parsePublishHttpReply(route, response, await response.text());
    },
    async history(route) {
      const suffix = route === "/" ? "" : route;
      const response = await request(`${baseUrl}/api/history${suffix}`).catch(() => undefined);
      if (response === undefined || !response.ok) return undefined;
      return parseHistoryHttpReply(await response.text());
    },
  };
}
