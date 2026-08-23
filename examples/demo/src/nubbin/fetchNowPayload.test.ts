import { afterEach, describe, expect, test, vi } from "vitest";
import { fetchNowPayload } from "./fetchNowPayload";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

/** Stubbing `fetch` stubs the network, not a schema — the request itself is the thing under test. */
const recordFetch = () => {
  const calls: { url: string; init: RequestInit | undefined }[] = [];
  vi.stubGlobal("fetch", (url: string, init?: RequestInit) => {
    calls.push({ url, init });
    return Promise.resolve(Response.json({ now: 1, served: 2 }));
  });
  return calls;
};

describe("fetchNowPayload", () => {
  // The origin is built from PORT, so a server on another port resolves its holes against
  // itself rather than against whatever else happens to be listening on 3000.
  test("the origin follows PORT rather than assuming one", async () => {
    const calls = recordFetch();
    vi.stubEnv("PORT", "4100");
    await fetchNowPayload({ revalidate: 5 });
    expect(calls[0]?.url).toBe("http://127.0.0.1:4100/api/now");
  });

  test("an interval hole carries the declared revalidate", async () => {
    const calls = recordFetch();
    await fetchNowPayload({ revalidate: 5 });
    expect(calls[0]?.init).toEqual({ next: { revalidate: 5 } });
  });

  test("returns the body", async () => {
    recordFetch();
    expect(await fetchNowPayload({ revalidate: 5 })).toEqual({ now: 1, served: 2 });
  });

  test("a failed response throws naming the status rather than shaping undefined", async () => {
    vi.stubGlobal("fetch", () => Promise.resolve(new Response("no", { status: 503 })));
    await expect(fetchNowPayload({ revalidate: 5 })).rejects.toThrow("/api/now answered 503");
  });
});
