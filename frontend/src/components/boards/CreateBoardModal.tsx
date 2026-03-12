import { useState } from "react";

export default function CreateBoardModal({
  onClose,
  onCreate,
  isLoading,
}: {
  onClose: () => void;
  onCreate: (name: string) => void;
  isLoading: boolean;
}) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) onCreate(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="panel relative z-10 w-full max-w-md p-6">
        <h2
          className="mb-4 text-xl font-bold"
          style={{ fontFamily: "Syne" }}
        >
          Create New Board
        </h2>
        <form onSubmit={handleSubmit}>
          <label className="mb-1 block text-sm text-[var(--text-secondary)]">
            Board Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My awesome board..."
            autoFocus
            className="mb-4 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 outline-none transition-colors focus:border-[var(--border-active)]"
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || isLoading}
              className="rounded-lg bg-[var(--accent)] px-5 py-2 text-sm font-medium text-[var(--surface-0)] transition-opacity disabled:opacity-40"
            >
              {isLoading ? "Creating..." : "Create Board"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
