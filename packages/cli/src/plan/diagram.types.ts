/** Who runs a node: the customer, or Nubbin. */
export type DiagramOwner = "you" | "nubbin";

/** Where a node sits in the publish path, from composing a draft to reading an artifact. */
export type DiagramStage = "author" | "publish" | "store" | "serve" | "consume";

/** A box: what it is, who runs it, and which stage it belongs to. */
export type DiagramNode = {
  id: string;
  label: string;
  owner: DiagramOwner;
  stage: DiagramStage;
};

/** An arrow between two nodes, optionally carrying what travels along it. */
export type DiagramEdge = {
  from: string;
  to: string;
  label?: string;
};

/**
 * The system picture as a model rather than as a drawing: the website renders it in its own brand,
 * the command line prints it as text, and neither holds a rule.
 */
export type Diagram = {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
};
