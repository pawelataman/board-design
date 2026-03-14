import { Link } from "react-router-dom";
import { UserButton } from "@clerk/react";
import { Plus } from "@phosphor-icons/react";

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
            <Plus size={16} weight="bold" />
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
