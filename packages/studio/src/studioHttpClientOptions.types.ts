/** Host-owned transport configuration. A wrapped fetch can add credentials, headers, tracing,
 * or any authentication policy without making those concerns part of the editor package. */
export interface StudioHttpClientOptions {
  readonly baseUrl?: string;
  readonly fetch?: typeof globalThis.fetch;
}
