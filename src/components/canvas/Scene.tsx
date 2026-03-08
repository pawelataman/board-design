import { Suspense, useEffect, useCallback, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import { Vector3, WebGLRenderTarget, type PerspectiveCamera } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import Board from "./Board";
import { useDesignStore } from "../../store/useDesignStore";

// ── Constants for dual-face export ───────────────────────────────

/** Export resolution for each face panel (width x height) */
const EXPORT_W = 800;
const EXPORT_H = 1200;
/** Padding around each cropped panel */
const PADDING = 16;
/** Gap between the two cropped panels */
const GAP = 24;

// Camera positions for front / back renders (looking at board center)
const BOARD_CENTER = new Vector3(0, 0.12, 0);
const FRONT_CAM_POS = new Vector3(0, 0.12, 3.8);
const BACK_CAM_POS = new Vector3(0, 0.12, -3.8);

// ── Screenshot handler (runs inside the Canvas tree) ─────────────

function ScreenshotHandler() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const controls = useThree((s) => s.controls as OrbitControlsImpl | undefined);
  const controlsRef = useRef<OrbitControlsImpl | undefined>(controls);

  useEffect(() => {
    controlsRef.current = controls;
  }, [controls]);

  const screenshotRequested = useDesignStore((s) => s.screenshotRequested);
  const clearScreenshotRequest = useDesignStore(
    (s) => s.clearScreenshotRequest,
  );

  const exportDualFace = useCallback(() => {
    // ── 1. Save camera + controls state ──
    const savedPos = camera.position.clone();
    const savedQuat = camera.quaternion.clone();
    const savedFov = camera.fov;
    const savedAspect = camera.aspect;
    const orbitControls = controlsRef.current;
    const savedTarget = orbitControls
      ? orbitControls.target.clone()
      : new Vector3();

    // ── 2. Create render targets ──
    const rtFront = new WebGLRenderTarget(EXPORT_W, EXPORT_H);
    const rtBack = new WebGLRenderTarget(EXPORT_W, EXPORT_H);

    // Configure camera for the export aspect ratio
    camera.aspect = EXPORT_W / EXPORT_H;
    camera.fov = 45;
    camera.updateProjectionMatrix();

    // ── 3. Render front face ──
    camera.position.copy(FRONT_CAM_POS);
    camera.lookAt(BOARD_CENTER);
    camera.updateMatrixWorld();

    gl.setRenderTarget(rtFront);
    gl.clear();
    gl.render(scene, camera);

    // ── 4. Render back face ──
    camera.position.copy(BACK_CAM_POS);
    camera.lookAt(BOARD_CENTER);
    camera.updateMatrixWorld();

    gl.setRenderTarget(rtBack);
    gl.clear();
    gl.render(scene, camera);

    // ── 5. Read pixels from both targets ──
    const frontPixels = new Uint8Array(EXPORT_W * EXPORT_H * 4);
    const backPixels = new Uint8Array(EXPORT_W * EXPORT_H * 4);

    gl.readRenderTargetPixels(rtFront, 0, 0, EXPORT_W, EXPORT_H, frontPixels);
    gl.readRenderTargetPixels(rtBack, 0, 0, EXPORT_W, EXPORT_H, backPixels);

    // ── 6. Restore camera, controls, and clean up render targets ──
    gl.setRenderTarget(null);
    rtFront.dispose();
    rtBack.dispose();

    camera.position.copy(savedPos);
    camera.quaternion.copy(savedQuat);
    camera.fov = savedFov;
    camera.aspect = savedAspect;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();

    // Restore OrbitControls target so the view doesn't snap
    if (orbitControls) {
      orbitControls.target.copy(savedTarget);
      orbitControls.update();
    }

    // Re-render the scene at the original view so the user sees no flicker
    gl.render(scene, camera);

    // ── 7. Composite onto a 2D canvas (cropped to board area) ──

    // Helper: write pixel buffer (WebGL is bottom-up) to an ImageData, flip vertically
    const toImageData = (pixels: Uint8Array): ImageData => {
      const imgData = new ImageData(EXPORT_W, EXPORT_H);
      for (let y = 0; y < EXPORT_H; y++) {
        const srcRow = (EXPORT_H - 1 - y) * EXPORT_W * 4; // flip Y
        const dstRow = y * EXPORT_W * 4;
        for (let x = 0; x < EXPORT_W * 4; x++) {
          imgData.data[dstRow + x] = pixels[srcRow + x];
        }
      }
      return imgData;
    };

    // Helper: find the bounding box of non-background pixels.
    // Sample the top-left corner pixel as the "background" color.
    const findBounds = (imgData: ImageData) => {
      const { data, width, height } = imgData;
      // Use pixel (0,0) as reference background color
      const bgR = data[0];
      const bgG = data[1];
      const bgB = data[2];
      const threshold = 12; // tolerance for anti-aliasing / slight color variation

      let minX = width;
      let minY = height;
      let maxX = 0;
      let maxY = 0;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4;
          const dr = Math.abs(data[i] - bgR);
          const dg = Math.abs(data[i + 1] - bgG);
          const db = Math.abs(data[i + 2] - bgB);
          if (dr > threshold || dg > threshold || db > threshold) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      // If nothing found (blank image), return full dimensions
      if (maxX < minX) return { x: 0, y: 0, w: width, h: height };
      return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
    };

    const frontImg = toImageData(frontPixels);
    const backImg = toImageData(backPixels);

    const frontBounds = findBounds(frontImg);
    const backBounds = findBounds(backImg);

    // Use the union height so both panels are vertically aligned
    const cropTop = Math.min(frontBounds.y, backBounds.y);
    const cropBottom = Math.max(
      frontBounds.y + frontBounds.h,
      backBounds.y + backBounds.h,
    );
    const cropH = cropBottom - cropTop;

    const frontCropW = frontBounds.w;
    const backCropW = backBounds.w;

    const totalW = PADDING + frontCropW + GAP + backCropW + PADDING;
    const totalH = PADDING + cropH + PADDING;

    // Put full renders onto temp canvases so we can drawImage with crop params
    const frontCanvas = document.createElement("canvas");
    frontCanvas.width = EXPORT_W;
    frontCanvas.height = EXPORT_H;
    frontCanvas.getContext("2d")!.putImageData(frontImg, 0, 0);

    const backCanvas = document.createElement("canvas");
    backCanvas.width = EXPORT_W;
    backCanvas.height = EXPORT_H;
    backCanvas.getContext("2d")!.putImageData(backImg, 0, 0);

    // Final composited canvas
    const offscreen = document.createElement("canvas");
    offscreen.width = totalW;
    offscreen.height = totalH;
    const ctx = offscreen.getContext("2d")!;

    // Background
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, totalW, totalH);

    // Draw cropped front panel
    ctx.drawImage(
      frontCanvas,
      frontBounds.x, cropTop, frontCropW, cropH, // source rect
      PADDING, PADDING, frontCropW, cropH,        // dest rect
    );

    // Draw cropped back panel
    ctx.drawImage(
      backCanvas,
      backBounds.x, cropTop, backCropW, cropH,                    // source rect
      PADDING + frontCropW + GAP, PADDING, backCropW, cropH,      // dest rect
    );

    // ── 8. Download ──
    offscreen.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `board-design-export-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, "image/png");
  }, [gl, scene, camera]);

  useEffect(() => {
    if (!screenshotRequested) return;

    // Use requestAnimationFrame to ensure gizmos have been hidden
    // (ElementGizmo returns null when screenshotRequested is true)
    requestAnimationFrame(() => {
      exportDualFace();
      clearScreenshotRequest();
    });
  }, [screenshotRequested, clearScreenshotRequest, exportDualFace]);

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
