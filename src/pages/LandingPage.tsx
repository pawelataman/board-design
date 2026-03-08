import { Link } from "react-router-dom";
import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF, ContactShadows } from "@react-three/drei";
import type { Group, Mesh } from "three";
import type { GLTF } from "three/examples/jsm/Addons.js";

// ── 3D Hero Board (auto-rotating preview) ────────────────────────

type GLTFResult = GLTF & {
  nodes: { Edge: Mesh; Front: Mesh; Back: Mesh };
};

const BOARD_MODEL_URL = `${import.meta.env.BASE_URL}models/snowboard.glb`;

function HeroBoard() {
  const { nodes } = useGLTF(BOARD_MODEL_URL) as unknown as GLTFResult;
  const groupRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.Edge.geometry}>
        <meshStandardMaterial
          color="#1a2942"
          roughness={0.58}
          metalness={0.24}
          envMapIntensity={1.15}
        />
      </mesh>
      <mesh receiveShadow geometry={nodes.Front.geometry}>
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.35}
          metalness={0.15}
          envMapIntensity={1.25}
        />
      </mesh>
      <mesh castShadow receiveShadow geometry={nodes.Back.geometry}>
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.35}
          metalness={0.15}
          envMapIntensity={1.25}
        />
      </mesh>
    </group>
  );
}

function HeroCanvas() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.5, 4.5], fov: 40 }}
      style={{ width: "100%", height: "100%" }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.7} />
        <directionalLight
          castShadow
          intensity={2}
          position={[3, 4, 3]}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight intensity={0.5} position={[-3, -1, 2]} color="#cfe7ff" />
        <Environment preset="city" />
        <group position={[0, 0.1, 0]}>
          <HeroBoard />
        </group>
        <ContactShadows
          position={[0, -1.72, 0]}
          scale={6}
          blur={2.2}
          far={4}
          opacity={0.35}
          color="#0f172a"
        />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Suspense>
    </Canvas>
  );
}

// ── Animated counter ─────────────────────────────────────────────

function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1500;
          const start = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(target * eased));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// ── Icon components ──────────────────────────────────────────────

const iconBase = {
  width: 28,
  height: 28,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

const PenToolIcon = () => (
  <svg {...iconBase}>
    <title>Pen tool</title>
    <path d="M12 19l7-7 3 3-7 7-3-3z" />
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
    <path d="M2 2l7.586 7.586" />
    <circle cx="11" cy="11" r="2" />
  </svg>
);

const LayersIcon = () => (
  <svg {...iconBase}>
    <title>Layers</title>
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const Share2Icon = () => (
  <svg {...iconBase}>
    <title>Share</title>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const ZapIcon = () => (
  <svg {...iconBase}>
    <title>Lightning bolt</title>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const ImageIcon = () => (
  <svg {...iconBase}>
    <title>Image</title>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const SmartphoneIcon = () => (
  <svg {...iconBase}>
    <title>Smartphone</title>
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

// ── Section wrapper with scroll animation ────────────────────────

function FadeInSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"} ${className}`}
    >
      {children}
    </div>
  );
}

// ── Data ─────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: <PenToolIcon />,
    title: "Precision Placement",
    description:
      "Place stickers, text, and images with pixel-perfect accuracy using intuitive drag-and-rotate gizmos.",
  },
  {
    icon: <LayersIcon />,
    title: "Layer Management",
    description:
      "Full layer panel with reordering, visibility toggles, and lock controls. Just like Figma.",
  },
  {
    icon: <ImageIcon />,
    title: "Custom Graphics",
    description:
      "Upload your own images or choose from our curated library of 24+ premium sticker designs.",
  },
  {
    icon: <Share2Icon />,
    title: "Instant Sharing",
    description:
      "Generate a share URL with one click. Your entire design is encoded and ready to send.",
  },
  {
    icon: <ZapIcon />,
    title: "Real-time 3D",
    description:
      "See every change live on a physically-based 3D model with environment lighting and shadows.",
  },
  {
    icon: <SmartphoneIcon />,
    title: "Mobile Ready",
    description:
      "Fully responsive design with touch controls. Design on the go from any device.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Choose Your Canvas",
    description: "Pick a side — front or back — and set your board color and material properties.",
  },
  {
    step: "02",
    title: "Add Your Design",
    description:
      "Drop stickers, type custom text, or upload images. Position, rotate, and scale with precision.",
  },
  {
    step: "03",
    title: "Share & Export",
    description:
      "Generate a unique URL to share your design with anyone, or save it for later.",
  },
];

const STATS = [
  { value: 24, suffix: "+", label: "Sticker Designs" },
  { value: 100, suffix: "%", label: "Browser-based" },
  { value: 0, suffix: "", label: "Downloads Required", display: "Zero" },
  { value: 60, suffix: "fps", label: "Real-time 3D" },
];

const TESTIMONIALS = [
  {
    quote:
      "Finally a board designer that doesn't feel like software from 2005. The 3D preview is chef's kiss.",
    name: "Alex Rivera",
    role: "Pro Snowboarder",
    avatar: "AR",
  },
  {
    quote:
      "I use this to prototype custom board graphics before sending them to print. Saves me hours.",
    name: "Sarah Chen",
    role: "Graphic Designer",
    avatar: "SC",
  },
  {
    quote:
      "The share link feature is genius. I send mockups to clients and they can see the design in 3D.",
    name: "Marcus Webb",
    role: "Board Shop Owner",
    avatar: "MW",
  },
];

// ── Main Landing Page ────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="landing-page min-h-screen bg-[#04070d] text-white">
      {/* ── Navbar ────────────────────────────────────────────── */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#04070d]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--accent)] to-cyan-400">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#04070d"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <title>BoardCraft logo</title>
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight" style={{ fontFamily: "Syne" }}>
              BoardCraft
            </span>
          </div>

          <div className="hidden items-center gap-8 text-sm text-[var(--text-secondary)] md:flex">
            <a href="#features" className="transition-colors hover:text-white">
              Features
            </a>
            <a href="#how-it-works" className="transition-colors hover:text-white">
              How It Works
            </a>
            <a href="#testimonials" className="transition-colors hover:text-white">
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

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-24">
        {/* Background effects */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(125,211,252,0.08),transparent_70%)]" />
          <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.06),transparent_70%)]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 pb-8 pt-16 md:pt-24">
          <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
            {/* Left: Copy */}
            <div className="flex flex-col gap-6">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/5 px-4 py-1.5 text-xs font-medium text-[var(--accent)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                Now in Public Beta
              </div>

              <h1
                className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
                style={{ fontFamily: "Syne" }}
              >
                Design Your Dream{" "}
                <span className="bg-gradient-to-r from-[var(--accent)] via-cyan-300 to-sky-400 bg-clip-text text-transparent">
                  Snowboard
                </span>
              </h1>

              <p className="max-w-lg text-lg leading-relaxed text-[var(--text-secondary)]">
                The first browser-based 3D snowboard customizer. Place stickers,
                add text, upload graphics — see it all live on a realistic 3D
                model. No downloads, no accounts, no friction.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/app"
                  className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--accent)] to-cyan-400 px-7 py-3 text-sm font-semibold text-[#04070d] shadow-[0_0_24px_rgba(125,211,252,0.25)] transition-all hover:shadow-[0_0_40px_rgba(125,211,252,0.4)]"
                >
                  Start Designing
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform group-hover:translate-x-0.5"
                  >
                    <title>Arrow right</title>
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>

                <span className="text-sm text-[var(--text-secondary)]">
                  Free forever. No sign-up.
                </span>
              </div>
            </div>

            {/* Right: 3D Board Preview */}
            <div className="relative aspect-square w-full max-w-lg mx-auto">
              <div className="absolute inset-0 rounded-3xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent" />
              <HeroCanvas />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ─────────────────────────────────────────── */}
      <section className="border-y border-white/5 bg-white/[0.01]">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
          {STATS.map((stat) => (
            <FadeInSection key={stat.label} className="flex flex-col items-center gap-1 text-center">
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
              <span className="text-sm text-[var(--text-secondary)]">{stat.label}</span>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
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
                className={`group rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all hover:border-white/10 hover:bg-white/[0.04]`}
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

      {/* ── How It Works ──────────────────────────────────────── */}
      <section id="how-it-works" className="border-y border-white/5 bg-white/[0.01] py-24">
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
              <FadeInSection key={step.step} className="relative flex flex-col gap-4">
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

      {/* ── Testimonials ──────────────────────────────────────── */}
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
                    <p className="text-xs text-[var(--text-secondary)]">{t.role}</p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────── */}
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
            Jump into the designer and bring your vision to life. It takes 30 seconds.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <Link
              to="/app"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--accent)] to-cyan-400 px-8 py-3.5 text-base font-semibold text-[#04070d] shadow-[0_0_32px_rgba(125,211,252,0.3)] transition-all hover:shadow-[0_0_48px_rgba(125,211,252,0.5)]"
            >
              Open Designer
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-hover:translate-x-0.5"
              >
                <title>Arrow right</title>
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <span className="text-sm text-[var(--text-secondary)]">
              No sign-up required
            </span>
          </div>
        </FadeInSection>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 bg-[#04070d]">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-10 md:flex-row md:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--accent)] to-cyan-400">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#04070d"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <title>BoardCraft logo</title>
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <span className="text-sm font-bold tracking-tight" style={{ fontFamily: "Syne" }}>
              BoardCraft
            </span>
          </div>

          <div className="flex gap-8 text-sm text-[var(--text-secondary)]">
            <a href="#features" className="transition-colors hover:text-white">
              Features
            </a>
            <a href="#how-it-works" className="transition-colors hover:text-white">
              How It Works
            </a>
            <Link to="/app" className="transition-colors hover:text-white">
              Designer
            </Link>
          </div>

          <p className="text-xs text-[var(--text-secondary)]">
            &copy; {new Date().getFullYear()} BoardCraft. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
