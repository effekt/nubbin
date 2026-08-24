/**
 * `set` takes its value from a command line, where everything arrives as a string. JSON is the
 * one notation a shell user already knows for saying "this is a number", so `42`, `true` and
 * `{"a":1}` arrive typed — and anything JSON refuses is the string as given, which is what a
 * person typing a headline meant by it.
 */
export function parseValueLiteral(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}
