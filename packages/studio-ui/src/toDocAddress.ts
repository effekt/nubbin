/**
 * The toolbar pill's address: the route resolved against the consumer origin — the site
 * the page actually serves from — shown scheme-less the way the specimen writes it
 * ("windwardsupply.com/spring-sale"), with the full URL kept for the pill to open. With no
 * origin, or an origin that is not a URL, only the route can be said, and nothing opens.
 */
export function toDocAddress(
  origin: string | undefined,
  route: string,
): { label: string; href?: string } {
  if (origin === undefined) {
    return { label: route };
  }
  try {
    const url = new URL(route, origin);
    return { label: `${url.host}${url.pathname}`, href: url.href };
  } catch {
    return { label: route };
  }
}
