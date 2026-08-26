import type { ReactNode } from "react";

/** Applies one side of an explicit conflict without obscuring the choice in the caller. */
export function ResolutionButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  );
}
