"use client";

import { type RefObject, useEffect, useState } from "react";

/** The inline `transform` of the nearest ancestor matching `selector`, kept current as its
 * owner rewrites it. Puck holds the canvas zoom in exactly one place the overlay can reach —
 * the inverse `scale(1 / zoom)` it sets inline on its actions container — so an element
 * portalled outside that container mirrors the factor by watching the attribute rather than
 * knowing the zoom. Empty while unmounted or with no such ancestor. */
export function useMirroredTransform(ref: RefObject<HTMLElement | null>, selector: string): string {
  const [transform, setTransform] = useState("");
  useEffect(() => {
    const target = ref.current?.closest<HTMLElement>(selector);
    if (target == null) {
      return;
    }
    const read = () => setTransform(target.style.transform);
    read();
    const observer = new MutationObserver(read);
    observer.observe(target, { attributes: true, attributeFilter: ["style"] });
    return () => observer.disconnect();
  }, [ref, selector]);
  return transform;
}
