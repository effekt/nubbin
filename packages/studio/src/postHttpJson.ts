/** Posts one JSON body through the host-selected fetch implementation. */
export function postHttpJson(
  request: typeof globalThis.fetch,
  url: string,
  body: unknown,
): Promise<Response> {
  return request(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}
