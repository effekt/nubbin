/** Builds the common untrusted-JSON envelope boundary for Studio request handlers. */
export function createParsedRequestHandler<Value>(
  parse: (body: unknown) => Value | undefined,
  malformedMessage: string,
  handle: (value: Value) => Response | Promise<Response>,
) {
  return async (request: Request): Promise<Response> => {
    const value = parse(await request.json().catch(() => undefined));
    return value === undefined ? new Response(malformedMessage, { status: 400 }) : handle(value);
  };
}
