import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import Board from "./Board";
import { useDesignStore } from "../../store/useDesignStore";

export default function Scene() {
  const clearSelection = useDesignStore((s) => s.clearSelection);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0, 4], fov: 45 }}
      onPointerMissed={() => clearSelection()}
      style={{ position: "absolute", inset: 0, touchAction: "none" }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.8} />
        <directionalLight
          castShadow
          intensity={2.2}
          position={[2.8, 4.2, 3.4]}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />
        <directionalLight
          intensity={0.6}
          position={[-3, -1.5, 2.5]}
          color="#cfe7ff"
        />
        <Environment preset="city" />

        <group position={[0, 0.12, 0]}>
          <Board />
        </group>

        <ContactShadows
          position={[0, -1.72, 0]}
          scale={6}
          blur={2.1}
          far={4}
          opacity={0.48}
          color="#0f172a"
        />

        <EffectComposer>
          <Bloom
            luminanceThreshold={0.72}
            luminanceSmoothing={0.18}
            intensity={0.28}
            mipmapBlur
          />
        </EffectComposer>

        <OrbitControls enablePan minDistance={2} maxDistance={7} makeDefault />
      </Suspense>
    </Canvas>
  );
}
