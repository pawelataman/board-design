import type { Board } from "../../types/board";

export default function DeleteConfirmModal({
  board,
  onClose,
  onConfirm,
  isLoading,
}: {
  board: Board;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="panel relative z-10 w-full max-w-sm p-6">
        <h2
          className="mb-2 text-lg font-bold"
          style={{ fontFamily: "Syne" }}
        >
          Delete Board
        </h2>
        <p className="mb-5 text-sm text-[var(--text-secondary)]">
          Are you sure you want to delete{" "}
          <span className="text-[var(--text-primary)]">{board.name}</span>?
          This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-lg bg-[var(--danger)] px-5 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-40"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
