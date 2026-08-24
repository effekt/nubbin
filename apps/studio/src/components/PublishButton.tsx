"use client";

interface PublishButtonProps {
  onPublish: () => void;
}

/** The studio's primary action as a real `button`: focusable, pressed by Enter or Space,
 * announced with its role — and bordered as well as filled, so it survives forced-colors
 * mode. It stands where Puck's own publish control would render. */
export function PublishButton({ onPublish }: PublishButtonProps) {
  return (
    <button
      type="button"
      onClick={onPublish}
      className="rounded-md border border-orange-deep bg-orange-deep px-4 py-1.5 font-semibold text-white focus:outline-none focus-visible:ring-2"
    >
      Publish
    </button>
  );
}
