import { XCircle } from "@phosphor-icons/react";

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
        <XCircle size={48} weight="light" className="opacity-60" color="var(--danger)" />
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
