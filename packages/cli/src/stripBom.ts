/** What a Windows editor or PowerShell's `>` puts in front of UTF-8 text, and `JSON.parse` refuses. */
const BOM = "﻿";

/**
 * The text without a leading byte order mark. The mark is invisible, so a parser refusing it
 * reports an unexpected token nobody can see in the file; stripping it where the file is read
 * means the parser sees what the person sees.
 */
export const stripBom = (text: string): string =>
  text.startsWith(BOM) ? text.slice(BOM.length) : text;
