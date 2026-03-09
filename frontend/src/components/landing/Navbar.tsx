import { Link } from "react-router-dom";

const logoUrl = `${import.meta.env.BASE_URL}logo.png`;

export default function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#04070d]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2.5">
          <img
            src={logoUrl}
            alt="Board Design"
            className="h-8 w-8 rounded-lg object-contain"
          />
          <span
            className="text-lg font-bold tracking-tight"
            style={{ fontFamily: "Syne" }}
          >
            Board Design
          </span>
        </div>

        <div className="hidden items-center gap-8 text-sm text-[var(--text-secondary)] md:flex">
          <a href="#features" className="transition-colors hover:text-white">
            Features
          </a>
          <a
            href="#how-it-works"
            className="transition-colors hover:text-white"
          >
            How It Works
          </a>
          <a
            href="#testimonials"
            className="transition-colors hover:text-white"
          >
            Testimonials
          </a>
        </div>

        <Link
          to="/app"
          className="rounded-full bg-white/10 px-5 py-2 text-sm font-medium text-white backdrop-blur transition-all hover:bg-white/20"
        >
          Launch App
        </Link>
      </div>
    </nav>
  );
}
