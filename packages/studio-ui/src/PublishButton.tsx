"use client";

interface PublishButtonProps {
  label: string;
  onPublish: () => void;
}

/** The studio's primary action as a real `button`: focusable, pressed by Enter or Space,
 * announced with its role — and bordered as well as filled, so it survives forced-colors
 * mode. It stands where Puck's own publish control would render, wearing whichever label
 * the moment earns — `Publish changes` while the draft is ahead, `Published ✓` after. */
export function PublishButton({ label, onPublish }: PublishButtonProps) {
  return (
    <button type="button" onClick={onPublish} className="nubbin-publish-button">
      {label}
    </button>
  );
}
