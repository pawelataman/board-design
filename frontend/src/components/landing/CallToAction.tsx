import { Link } from "react-router-dom";
import FadeInSection from "./FadeInSection";
import { ArrowRightIcon } from "./icons";

export default function CallToAction() {
  return (
    <section className="relative overflow-hidden border-t border-white/5 py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(125,211,252,0.06),transparent_70%)]" />

      <FadeInSection className="relative mx-auto max-w-2xl px-6 text-center">
        <h2
          className="text-3xl font-bold tracking-tight sm:text-5xl"
          style={{ fontFamily: "Syne" }}
        >
          Ready to Create?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-lg text-[var(--text-secondary)]">
          Jump into the designer and bring your vision to life. It takes 30
          seconds.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Link
             to="/boards"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--accent)] to-cyan-400 px-8 py-3.5 text-base font-semibold text-[#04070d] shadow-[0_0_32px_rgba(125,211,252,0.3)] transition-all hover:shadow-[0_0_48px_rgba(125,211,252,0.5)]"
          >
            Open Designer
            <ArrowRightIcon className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <span className="text-sm text-[var(--text-secondary)]">
            Free forever. Get started in seconds.
          </span>
        </div>
      </FadeInSection>
    </section>
  );
}
