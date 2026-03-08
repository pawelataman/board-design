import FadeInSection from "./FadeInSection";
import { FEATURES } from "./data";

export default function Features() {
  return (
    <section id="features" className="relative py-24">
      <div className="pointer-events-none absolute left-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(125,211,252,0.04),transparent_70%)]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <FadeInSection className="mb-16 text-center">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
            Features
          </span>
          <h2
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ fontFamily: "Syne" }}
          >
            Everything You Need
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[var(--text-secondary)]">
            A professional-grade design tool that runs entirely in your browser.
            No plugins, no installs, no compromises.
          </p>
        </FadeInSection>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <FadeInSection
              key={feature.title}
              className="group rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all hover:border-white/10 hover:bg-white/[0.04]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] transition-colors group-hover:bg-[var(--accent)]/15">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                {feature.description}
              </p>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}
