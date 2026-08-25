/** One compiler issue translated into the words and address an author can act on. */
export interface AuthorIssue {
  readonly nodeId?: string | undefined;
  readonly blockName?: string | undefined;
  readonly fieldLabel?: string | undefined;
  readonly path?: string | undefined;
  readonly message: string;
}
