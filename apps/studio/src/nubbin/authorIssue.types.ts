/**
 * One compiler issue in the words an author reads: the block's name and the field's label
 * where a lookup found them, and always a message. `nodeId` is present exactly when the
 * issue names a node the draft holds, which is what makes the issue clickable — the editor
 * can select that node in Puck.
 */
export interface AuthorIssue {
  /** The offending node's id, when the issue names one the draft holds. */
  readonly nodeId?: string | undefined;
  /** The block that node renders as — "Hero", not `n7`. */
  readonly blockName?: string | undefined;
  /** The field in author words, or the raw path where no label resolves. */
  readonly fieldLabel?: string | undefined;
  /** The compiler's own prose for what is wrong. */
  readonly message: string;
}
