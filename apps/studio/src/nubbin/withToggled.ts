/** The set with one member flipped: present becomes absent, absent becomes present. A new
 * set each call, so React state holding one sees the change. */
export function withToggled(set: ReadonlySet<string>, member: string): ReadonlySet<string> {
  const next = new Set(set);
  if (next.has(member)) {
    next.delete(member);
  } else {
    next.add(member);
  }
  return next;
}
