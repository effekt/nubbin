// Agent attribution on a commit distinguishes nothing when every commit carries it, and this
// repository's root already says who works here — `.claude/`, the agent definitions, the skills.
// The trailer is noise on a permanent artifact, so it is rejected at authoring time rather than
// left to whoever remembers. Co-authorship as such is untouched: the patterns name agents.
//
// Pull request bodies are the same decision and a different mechanism; `commitlint` never sees
// one, so `AGENTS.md` carries that half.
const AGENT_ATTRIBUTION = [
  [
    /^[ \t]*co-authored-by[ \t]*:.*\b(?:claude|anthropic|copilot|cursor|codex|devin|chatgpt)\b/im,
    "a Co-Authored-By: trailer naming an agent",
  ],
  // A trailer that attributes authorship to nobody is the same noise laundered: an RFC 2606
  // reserved domain cannot receive mail, and a one-letter name identifies no one. Both shapes
  // reached main as `Co-authored-by: t <t@example.com>` before this pattern existed.
  [
    /^[ \t]*co-authored-by[ \t]*:[^\n<]*<[^@>\n]+@(?:[^>\n]*\.)?(?:example(?:\.(?:com|net|org))?|invalid|test|localhost)[ \t]*>/im,
    "a Co-Authored-By: trailer with an unreachable placeholder address",
  ],
  [
    /^[ \t]*co-authored-by[ \t]*:[ \t]*\S[ \t]+</im,
    "a Co-Authored-By: trailer with a single-character name",
  ],
  [/^[ \t]*claude-session[ \t]*:/im, "a Claude-Session: trailer"],
  [/generated with \[claude code\]/i, "the 'Generated with Claude Code' footer"],
  // Anchored to the start of a line: the footer's bare session URL is attribution, a sentence
  // mentioning the host is prose, and a message explaining this rule has to be able to say it.
  [/^[ \t]*<?https?:\/\/claude\.ai\/code\b/im, "a bare claude.ai/code URL"],
];

/** Rejects agent attribution anywhere in the message, and names what to delete. */
const noAgentAttribution = (parsed) => {
  const found = AGENT_ATTRIBUTION.filter(([pattern]) => pattern.test(parsed.raw ?? "")).map(
    ([, description]) => description,
  );
  return [
    found.length === 0,
    `this repository carries no agent attribution — delete ${found.join(", ")}`,
  ];
};

/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ["@commitlint/config-conventional"],
  plugins: [{ rules: { "no-agent-attribution": noAgentAttribution } }],
  rules: {
    "scope-enum": [
      2,
      "always",
      [
        "docs",
        "repo",
        "deps",
        "examples",
        "studio",
        "site",
        "cli",
        "core",
        "next",
        "react",
        "store-fs",
      ],
    ],
    "no-agent-attribution": [2, "always"],
  },
};
