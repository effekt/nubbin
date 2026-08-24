import { readFileOrNull } from "./readFileOrNull";

/** An unknown hash or unpublished route reads as null, not a throw. */
export async function readJsonOrNull<T>(filePath: string): Promise<T | null> {
  const text = await readFileOrNull(filePath);
  return text === null ? null : (JSON.parse(text) as T);
}
