import FadeInSection from "./FadeInSection";
import { STEPS } from "./data";

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-y border-white/5 bg-white/[0.01] py-24"
    >
      <div className="mx-auto max-w-4xl px-6">
        <FadeInSection className="mb-16 text-center">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
            How It Works
          </span>
          <h2
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ fontFamily: "Syne" }}
          >
            Three Simple Steps
          </h2>
        </FadeInSection>

        <div className="grid gap-8 md:grid-cols-3">
          {STEPS.map((step) => (
            <FadeInSection
              key={step.step}
              className="relative flex flex-col gap-4"
            >
              <span
                className="text-5xl font-extrabold text-white/[0.04]"
                style={{ fontFamily: "Syne" }}
              >
                {step.step}
              </span>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                {step.description}
              </p>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}
