import { Suspense, useRef } from "react";
import { Link } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  useGLTF,
  ContactShadows,
} from "@react-three/drei";
import type { Group, Mesh } from "three";
import type { GLTF } from "three/examples/jsm/Addons.js";
import { ArrowRightIcon } from "./icons";

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
        <directionalLight
          intensity={0.5}
          position={[-3, -1, 2]}
          color="#cfe7ff"
        />
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

export default function Hero() {
  return (
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
                <ArrowRightIcon className="transition-transform group-hover:translate-x-0.5" />
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
  );
}

useGLTF.preload(BOARD_MODEL_URL);
