import { Link } from "react-router-dom";
import type { Board } from "../../types/board";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BoardCard({
  board,
  onDelete,
}: {
  board: Board;
  onDelete: (board: Board) => void;
}) {
  return (
    <div className="group panel flex flex-col overflow-hidden transition-all hover:border-[var(--border-active)]">
      {/* Preview */}
      <Link to={`/app?boardId=${board.id}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--surface-2)]">
          {board.previewUrl ? (
            <img
              src={board.previewUrl}
              alt={board.name}
              className="h-full w-full object-cover transition-transform group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#0f172a]">
              <img
                src="test-preview.png"
                className="object-contain h-full"
              ></img>
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1 p-4">
        <div className="flex items-start justify-between gap-2">
          <Link
            to={`/app?boardId=${board.id}`}
            className="truncate text-sm font-medium text-[var(--text-primary)] transition-colors hover:text-[var(--accent)]"
          >
            {board.name}
          </Link>
          <button
            type="button"
            onClick={() => onDelete(board)}
            title="Delete board"
            className="shrink-0 rounded p-1 text-[var(--text-secondary)] opacity-0 transition-all hover:bg-[var(--danger)]/15 hover:text-[var(--danger)] group-hover:opacity-100"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
          <span>{formatDate(board.createdAt)}</span>
          <span className="opacity-40">|</span>
          <span>
            {board.elements.length}{" "}
            {board.elements.length === 1 ? "element" : "elements"}
          </span>
        </div>

        {/* Surface color indicator */}
        <div className="mt-2 flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full border border-white/10"
            style={{ backgroundColor: board.surface.color }}
          />
          <span className="text-[11px] uppercase tracking-wider text-[var(--text-secondary)]/60">
            {board.surface.color}
          </span>
        </div>
      </div>
    </div>
  );
}
