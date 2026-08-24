/** A starting `meta.title` for a page created at a route: the last segment, separators as
 * spaces, first letter up — `/spring-sale` reads as "Spring sale". A name, because `title`
 * is the one required meta field; the author renames it in the editor. */
export function titleFromRoute(route: string): string {
  if (route === "/") {
    return "Home";
  }
  const last = route.split("/").at(-1) ?? "";
  const words = last.replace(/[-_]+/g, " ").trim();
  return words === "" ? route : words.charAt(0).toUpperCase() + words.slice(1);
}
