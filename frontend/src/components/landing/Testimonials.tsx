import FadeInSection from "./FadeInSection";
import { TESTIMONIALS } from "./data";

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <FadeInSection className="mb-16 text-center">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
            Testimonials
          </span>
          <h2
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ fontFamily: "Syne" }}
          >
            Loved by Creators
          </h2>
        </FadeInSection>

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <FadeInSection
              key={t.name}
              className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-6"
            >
              <p className="flex-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)]/20 to-cyan-500/20 text-xs font-bold text-[var(--accent)]">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {t.role}
                  </p>
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}
