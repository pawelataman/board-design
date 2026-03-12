export default function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="mb-4 rounded-2xl bg-[var(--danger)]/10 p-6">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--danger)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-60"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </div>
      <h3
        className="mb-1 text-lg font-bold text-[var(--text-primary)]"
        style={{ fontFamily: "Syne" }}
      >
        Failed to load boards
      </h3>
      <p className="mb-6 text-sm text-[var(--text-secondary)]">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-full border border-[var(--border)] px-6 py-2.5 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--border-active)]"
      >
        Retry
      </button>
    </div>
  );
}
