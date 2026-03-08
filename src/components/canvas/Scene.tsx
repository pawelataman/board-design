import { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import Board from "./Board";
import { useDesignStore } from "../../store/useDesignStore";

// ── Screenshot handler (runs inside the Canvas tree) ─────────────

function ScreenshotHandler() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const screenshotRequested = useDesignStore((s) => s.screenshotRequested);
  const clearScreenshotRequest = useDesignStore((s) => s.clearScreenshotRequest);

  useEffect(() => {
    if (!screenshotRequested) return;

    // Render one frame at 2x current pixel ratio for a sharp export
    const currentPixelRatio = gl.getPixelRatio();
    gl.setPixelRatio(currentPixelRatio * 2);
    gl.render(scene, camera);

    gl.domElement.toBlob((blob) => {
      // Restore original pixel ratio
      gl.setPixelRatio(currentPixelRatio);
      clearScreenshotRequest();

      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `boardcraft-export-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, "image/png");
  }, [screenshotRequested, clearScreenshotRequest, gl, scene, camera]);

  return null;
}

// ── Scene ────────────────────────────────────────────────────────

export default function Scene() {
  const clearSelection = useDesignStore((s) => s.clearSelection);

  return (
    <Canvas
      shadows
      gl={{ preserveDrawingBuffer: true }}
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

        <OrbitControls enablePan minDistance={2} maxDistance={7} makeDefault />
        <ScreenshotHandler />
      </Suspense>
    </Canvas>
  );
}
