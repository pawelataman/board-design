import { Link } from "react-router-dom";

const logoUrl = `${import.meta.env.BASE_URL}logo.png`;

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#04070d]">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-10 md:flex-row md:justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src={logoUrl}
            alt="Board Design"
            className="h-7 w-7 rounded-lg object-contain"
          />
          <span
            className="text-sm font-bold tracking-tight"
            style={{ fontFamily: "Syne" }}
          >
            Board Design
          </span>
        </div>

        <div className="flex gap-8 text-sm text-[var(--text-secondary)]">
          <a href="#features" className="transition-colors hover:text-white">
            Features
          </a>
          <a
            href="#how-it-works"
            className="transition-colors hover:text-white"
          >
            How It Works
          </a>
           <Link to="/boards" className="transition-colors hover:text-white">
            Designer
          </Link>
        </div>

        <p className="text-xs text-[var(--text-secondary)]">
          &copy; {new Date().getFullYear()} Board Design. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
