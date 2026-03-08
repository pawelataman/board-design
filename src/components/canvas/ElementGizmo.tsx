import { PivotControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Euler, MathUtils, Matrix4, Quaternion, Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useDesignStore } from "../../store/useDesignStore";

// Reusable temp objects to avoid allocations during drag
const _pos = new Vector3();
const _scale = new Vector3();
const _quat = new Quaternion();
const _euler = new Euler();

interface ElementGizmoProps {
  x: number;
  y: number;
  rotationZ: number;
  elementScale: number;
  side?: "front" | "back";
  scaleMax?: number;
  onTransform: (next: {
    x: number;
    y: number;
    rotation?: number;
    scale?: number;
  }) => void;
}

export default function ElementGizmo({
  x,
  y,
  rotationZ,
  elementScale,
  side = "front",
  scaleMax = 3,
  onTransform,
}: ElementGizmoProps) {
  const screenshotRequested = useDesignStore((s) => s.screenshotRequested);
  const controls = useThree(
    (state) => state.controls as OrbitControlsImpl | undefined,
  );
  const controlsRef = useRef<OrbitControlsImpl | undefined>(controls);

  useEffect(() => {
    controlsRef.current = controls;
  }, [controls]);

  // Build matrix: position + rotation + scale (baked so handles reflect actual size)
  // On the back side, the decal uses rotation=[0, Math.PI, rotation] which mirrors
  // the Z-rotation axis. We negate rotationZ in the gizmo matrix so the gizmo handle
  // visually matches the decal orientation, and negate the extracted euler.z on output.
  const isBack = side === "back";
  const depthOffset = 0.04;
  const matrix = useMemo(() => {
    const m = new Matrix4();
    const zPos = isBack ? -(0.04 + depthOffset) : 0.04 + depthOffset;
    const effectiveRotZ = isBack ? -rotationZ : rotationZ;
    m.compose(
      new Vector3(x, y, zPos),
      new Quaternion().setFromEuler(new Euler(0, 0, effectiveRotZ)),
      new Vector3(elementScale, elementScale, elementScale),
    );
    return m;
  }, [x, y, rotationZ, elementScale, isBack]);

  const scaleAtDragStart = useRef(elementScale);

  const handleDragStart = useCallback(() => {
    scaleAtDragStart.current = elementScale;
    if (controlsRef.current) {
      controlsRef.current.enabled = false;
    }
  }, [elementScale]);

  const handleDrag = useCallback(
    (local: Matrix4) => {
      local.decompose(_pos, _quat, _scale);
      _euler.setFromQuaternion(_quat);

      // PivotControls scales non-uniformly on one axis at a time.
      // Compare against the scale captured at drag start (stable reference)
      // to detect which axis the user is dragging.
      const base = scaleAtDragStart.current;
      const sx = _scale.x;
      const sy = _scale.y;
      const diffX = Math.abs(sx - base);
      const diffY = Math.abs(sy - base);
      const newScale = diffX > diffY ? sx : sy;

      // On the back side, the decal's [0, Math.PI, rotation] mirrors the Z-axis,
      // so we negate the gizmo's euler.z to get the correct store rotation value.
      const extractedRotation = isBack ? -_euler.z : _euler.z;

      onTransform({
        x: MathUtils.clamp(_pos.x, -0.6, 0.6),
        y: MathUtils.clamp(_pos.y, -1.35, 1.35),
        rotation: extractedRotation,
        scale: Math.min(newScale, scaleMax),
      });
    },
    [onTransform, scaleMax, isBack],
  );

  const handleDragEnd = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.enabled = true;
    }
  }, []);

  // Hide gizmos during screenshot capture
  if (screenshotRequested) return null;

  return (
    <PivotControls
      matrix={matrix}
      autoTransform={false}
      anchor={[0, 0, 0]}
      depthTest={false}
      lineWidth={2}
      axisColors={["#f43f5e", "#22c55e", "#3b82f6"]}
      activeAxes={[true, true, false]}
      scale={0.55}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
    >
      <mesh visible={false}>
        <boxGeometry args={[0.01, 0.01, 0.01]} />
      </mesh>
    </PivotControls>
  );
}
