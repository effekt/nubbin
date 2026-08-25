const FILE_HEADER = /^\*\*\* (?:Add|Delete|Update) File: (.+)$/gm;

/** Every path Codex or Claude says one edit changed. */
export function editedPaths(input) {
  const direct = input?.tool_input?.file_path;
  if (typeof direct === "string") return [direct];
  const patch = input?.tool_input?.command;
  if (typeof patch !== "string") return [];
  return [...patch.matchAll(FILE_HEADER)].map((match) => match[1]);
}
