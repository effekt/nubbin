/** What a link value is, if it is one: `"absolute"` for a parseable http(s) URL,
 * `"relative"` for a root-relative path, and `undefined` for anything else — including a
 * protocol-relative `//host`, which would silently borrow a scheme, and non-web schemes,
 * which the consumer's pages cannot serve. The check is a courtesy: the schema stays the
 * judge at publish, so an `undefined` here dims nothing and blocks nothing. */
export function toLinkKind(value: string): "absolute" | "relative" | undefined {
  if (value.startsWith("/")) {
    return value.startsWith("//") ? undefined : "relative";
  }
  if (!URL.canParse(value)) {
    return undefined;
  }
  const { protocol } = new URL(value);
  return protocol === "http:" || protocol === "https:" ? "absolute" : undefined;
}
