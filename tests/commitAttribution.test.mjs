// The no-agent-attribution rule rejects trailers that name an agent, and for a while that was
// the whole story. Then commits landed on main carrying `Co-authored-by: t <t@example.com>` — a
// trailer shaped precisely to pass the name check while attributing authorship to nobody. A
// placeholder co-author is worse than the trailer the rule already rejects: it is the same noise,
// anonymized. This suite pins the rule against both the named agents and the laundered form.

import { describe, expect, it } from "vitest";
import config from "../commitlint.config.mjs";

const rule = config.plugins[0].rules["no-agent-attribution"];
const verdict = (raw) => rule({ raw });

const SUBJECT = "fix(repo): a change described plainly";

describe("no-agent-attribution", () => {
  it("accepts a message with no trailers", () => {
    expect(verdict(`${SUBJECT}\n\nA body saying what changed.`)[0]).toBe(true);
  });

  it("accepts a human co-author at a real address", () => {
    const raw = `${SUBJECT}\n\nCo-authored-by: Jane Doe <jane@whlr.dev>`;
    expect(verdict(raw)[0]).toBe(true);
  });

  it("accepts prose that mentions a reserved domain outside a trailer", () => {
    const raw = `${SUBJECT}\n\nThe fixture now uses example.com as its placeholder origin.`;
    expect(verdict(raw)[0]).toBe(true);
  });

  it("rejects a trailer naming an agent", () => {
    const raw = `${SUBJECT}\n\nCo-Authored-By: Claude <noreply@anthropic.com>`;
    const [passes, message] = verdict(raw);
    expect(passes).toBe(false);
    expect(message).toContain("naming an agent");
  });

  it("rejects the placeholder trailer that reached main", () => {
    const raw = `${SUBJECT}\n\nCo-authored-by: t <t@example.com>`;
    expect(verdict(raw)[0]).toBe(false);
  });

  for (const address of [
    "someone@example.org",
    "someone@sub.example.net",
    "someone@unit.test",
    "someone@nowhere.invalid",
    "someone@localhost",
  ]) {
    it(`rejects a co-author at the unreachable address ${address}`, () => {
      const raw = `${SUBJECT}\n\nCo-authored-by: Some Name <${address}>`;
      expect(verdict(raw)[0]).toBe(false);
    });
  }

  it("rejects a single-character co-author name even at a real domain", () => {
    const raw = `${SUBJECT}\n\nCo-authored-by: t <t@whlr.dev>`;
    expect(verdict(raw)[0]).toBe(false);
  });
});
