import { PivotControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Euler, MathUtils, Matrix4, Quaternion, Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

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
  const controls = useThree(
    (state) => state.controls as OrbitControlsImpl | undefined,
  );
  const controlsRef = useRef<OrbitControlsImpl | undefined>(controls);

  useEffect(() => {
    controlsRef.current = controls;
  }, [controls]);

  // Build matrix: position + rotation + scale (baked so handles reflect actual size)
  // On the back side, the board is rotated 180° around Y, which mirrors X and Z.
  // PivotControls operates in the parent's local space, so we pass coordinates
  // through directly for both sides — no negation needed. Only Z depth differs.
  const isBack = side === "back";
  const depthOffset = 0.04;
  const matrix = useMemo(() => {
    const m = new Matrix4();
    const zPos = isBack ? -(0.04 + depthOffset) : 0.04 + depthOffset;
    m.compose(
      new Vector3(x, y, zPos),
      new Quaternion().setFromEuler(new Euler(0, 0, rotationZ)),
      new Vector3(elementScale, elementScale, elementScale),
    );
    return m;
  }, [x, y, rotationZ, elementScale, isBack]);

  const handleDragStart = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.enabled = false;
    }
  }, []);

  const handleDrag = useCallback(
    (local: Matrix4) => {
      local.decompose(_pos, _quat, _scale);
      _euler.setFromQuaternion(_quat);

      onTransform({
        x: MathUtils.clamp(_pos.x, -0.6, 0.6),
        y: MathUtils.clamp(_pos.y, -1.35, 1.35),
        rotation: _euler.z,
        scale: Math.min(Math.max(_scale.x, _scale.y), scaleMax),
      });
    },
    [onTransform, scaleMax],
  );

  const handleDragEnd = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.enabled = true;
    }
  }, []);

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
