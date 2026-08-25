/** Shared host seams for an HTTP boundary that loads a value by resolved route. */
export interface RoutedRequestHandlerOptions<Context, Value> {
  readonly route: (context: Context) => string | Promise<string>;
  readonly load: (route: string) => Value | Promise<Value>;
}
