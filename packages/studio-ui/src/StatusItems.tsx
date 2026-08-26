import { StatusItem } from "./StatusItem";
import type { StatusSegment } from "./statusSegment.types";

export function StatusItems({ segments }: { segments: readonly StatusSegment[] }) {
  return segments.map((segment) => <StatusItem key={segment.text} segment={segment} />);
}
