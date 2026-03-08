import FadeInSection from "./FadeInSection";
import AnimatedNumber from "./AnimatedNumber";
import { STATS } from "./data";

export default function StatsBar() {
  return (
    <section className="border-y border-white/5 bg-white/[0.01]">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
        {STATS.map((stat) => (
          <FadeInSection
            key={stat.label}
            className="flex flex-col items-center gap-1 text-center"
          >
            <span
              className="text-3xl font-bold tracking-tight text-white"
              style={{ fontFamily: "Syne" }}
            >
              {stat.display ? (
                stat.display
              ) : (
                <AnimatedNumber target={stat.value} suffix={stat.suffix} />
              )}
            </span>
            <span className="text-sm text-[var(--text-secondary)]">
              {stat.label}
            </span>
          </FadeInSection>
        ))}
      </div>
    </section>
  );
}
