import { Component, type ReactNode } from "react";
import { BrokenBlock } from "./BrokenBlock";

/**
 * Per-block error containment for the canvas: a block throwing on its draft props degrades
 * to `BrokenBlock` instead of taking the editor down, and the rest of the page renders
 * normally around it — the wireframes' rule for a block missing from the registry, applied
 * to one whose component crashed. A class because React still hands caught render errors
 * only to a class's `getDerivedStateFromError`; there is no hook for it in React 19. One
 * boundary wraps each node's own component, so a broken child inside a slot marks itself
 * and its parent keeps rendering. Recovery is by remount: `toPuckRender` keys the boundary
 * by the props' own values, so a fixed field renders the real block again with no reload.
 */
export class BlockBoundary extends Component<
  { blockName: string; children?: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  render(): ReactNode {
    if (this.state.failed) {
      return <BrokenBlock name={this.props.blockName} />;
    }
    return this.props.children;
  }
}
