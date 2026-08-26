/** A Studio field search's landing: the rendered element the addressing scheme resolved, and the
 * path prefix it stands for — the full path when the leaf's control is in the DOM, a
 * shorter one when only a container of it is. */
export interface FoundField {
  readonly element: HTMLElement;
  readonly path: string;
}
