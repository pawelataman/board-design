import { PlusSquare } from "@phosphor-icons/react";

export default function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="mb-4 rounded-2xl bg-[var(--surface-1)] p-6">
        <PlusSquare size={48} weight="light" className="opacity-60" color="var(--accent)" />
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
