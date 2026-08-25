import type { RoutedRequestHandlerOptions } from "./routedRequestHandlerOptions.types";

/** Resolves a host framework's route context and loads the value addressed by it. */
export async function loadRoutedValue<Context, Value>(
  options: RoutedRequestHandlerOptions<Context, Value>,
  context: Context,
): Promise<{ route: string; value: Value }> {
  const route = await options.route(context);
  return { route, value: await options.load(route) };
}
