import { ALPHABET, SINGLE_CHARACTER } from "./planCode.constants";

/**
 * The option a code character names, or `null` when the character addresses no option.
 *
 * The length check is what keeps the empty string out: `indexOf("")` is 0 in every JavaScript
 * engine, so without it an empty chunk would decode as a field's first option.
 */
export function parseOption(character: string, options: readonly string[]): string | null {
  if (character.length !== SINGLE_CHARACTER) return null;
  return options[ALPHABET.indexOf(character)] ?? null;
}
