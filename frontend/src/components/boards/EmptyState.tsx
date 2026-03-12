export default function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="mb-4 rounded-2xl bg-[var(--surface-1)] p-6">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-60"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      </div>
      <h3
        className="mb-1 text-lg font-bold text-[var(--text-primary)]"
        style={{ fontFamily: "Syne" }}
      >
        No boards yet
      </h3>
      <p className="mb-6 text-sm text-[var(--text-secondary)]">
        Create your first board to start designing.
      </p>
      <button
        type="button"
        onClick={onCreate}
        className="rounded-full bg-[var(--accent)] px-6 py-2.5 text-sm font-medium text-[var(--surface-0)] transition-opacity hover:opacity-90"
      >
        Create Board
      </button>
    </div>
  );
}
