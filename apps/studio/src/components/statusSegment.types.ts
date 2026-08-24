/** One strip segment: what it says, and the dot or voice it says it in. */
export interface StatusSegment {
  kind: "ok" | "amber" | "fix" | "plain";
  text: string;
}
