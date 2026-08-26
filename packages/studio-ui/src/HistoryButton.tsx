interface HistoryButtonProps {
  label: string;
  disabled: boolean;
  onClick: () => void;
  path: string;
}

export function HistoryButton({ label, disabled, onClick, path }: HistoryButtonProps) {
  return (
    <button
      type="button"
      className="nb-tb-icon"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
    >
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
        <path
          d={path}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
