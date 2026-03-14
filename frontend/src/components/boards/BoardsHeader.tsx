import { Link } from "react-router-dom";
import { UserButton } from "@clerk/react";

const logoUrl = `${import.meta.env.BASE_URL}logo.png`;

export default function BoardsHeader({
  onCreateClick,
}: {
  onCreateClick: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#04070d]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src={logoUrl}
            alt="Board Design"
            className="h-8 w-8 rounded-lg object-contain"
          />
          <span
            className="text-lg font-bold tracking-tight text-[var(--text-primary)]"
            style={{ fontFamily: "Syne" }}
          >
            Board Design
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onCreateClick}
            className="flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-medium text-[var(--surface-0)] transition-opacity hover:opacity-90"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Board
          </button>

          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-8 w-8",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
