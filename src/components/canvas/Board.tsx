import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import { Color, Mesh, Vector3 } from "three";
import type { Group } from "three";
import type { GLTF } from "three/examples/jsm/Addons.js";
import StickerDecal from "./StickerDecal";
import TextDecal from "./TextDecal";
import ImageDecal from "./ImageDecal";
import ElementGizmo from "./ElementGizmo";
import { useDesignStore } from "../../store/useDesignStore";

type GLTFResult = GLTF & {
  nodes: { Edge: Mesh; Front: Mesh; Back: Mesh };
};

const BOARD_MODEL_URL = "/models/snowboard.glb";

export default function Board() {
  const { nodes } = useGLTF(BOARD_MODEL_URL) as unknown as GLTFResult;

  // Individual primitive selectors — safe with React Compiler
  const activeSide = useDesignStore((s) => s.activeSide);
  const boardColor = useDesignStore((s) => s.board.color);
  const boardRoughness = useDesignStore((s) => s.board.roughness);
  const boardMetalness = useDesignStore((s) => s.board.metalness);
  const elements = useDesignStore((s) => s.elements);
  const selectedId = useDesignStore((s) => s.selectedId);
  const updateElement = useDesignStore((s) => s.updateElement);

  const edgeColor = useMemo(() => {
    const c = new Color(boardColor);
    return c.offsetHSL(0, -0.03, -0.18).getStyle();
  }, [boardColor]);

  // Filter and sort elements per side
  const frontElements = useMemo(
    () =>
      elements
        .filter((e) => e.side === "front" && e.visible)
        .sort((a, b) => a.order - b.order),
    [elements],
  );

  const backElements = useMemo(
    () =>
      elements
        .filter((e) => e.side === "back" && e.visible)
        .sort((a, b) => a.order - b.order),
    [elements],
  );

  // Track whether the camera is looking at the front or back face of the board.
  // We compute the world-space forward (Z+) of the board group and dot it with
  // the camera direction each frame.
  const boardGroupRef = useRef<Group>(null);
  const [cameraFacing, setCameraFacing] = useState<"front" | "back">("front");
  const _worldZ = useMemo(() => new Vector3(), []);
  const _camDir = useMemo(() => new Vector3(), []);

  useFrame(({ camera }) => {
    const group = boardGroupRef.current;
    if (!group) return;

    // Board front face normal in world space (local +Z transformed by group)
    _worldZ.set(0, 0, 1).applyQuaternion(group.quaternion);
    // Camera look direction (from camera towards scene)
    _camDir.copy(camera.position).normalize();

    // If dot > 0, camera is on the front-face side; < 0 means back-face side
    const dot = _worldZ.dot(_camDir);
    const facing = dot > 0 ? "front" : "back";
    if (facing !== cameraFacing) {
      setCameraFacing(facing);
    }
  });

  // Only show gizmos when the active side matches what the camera is actually seeing
  const showGizmos = cameraFacing === activeSide;

  const renderDecal = (el: (typeof elements)[0], isSelected: boolean, side: "front" | "back") => {
    const t = el.transform;
    switch (el.kind) {
      case "sticker":
        return (
          <StickerDecal
            key={el.id}
            id={el.id}
            url={el.url!}
            side={side}
            x={t.x}
            y={t.y}
            rotation={t.rotation}
            scale={t.scale}
            opacity={el.opacity ?? 1}
            order={el.order}
            selected={isSelected}
          />
        );
      case "text":
        return (
          <TextDecal
            key={el.id}
            id={el.id}
            text={el.text ?? "Text"}
            fontFamily={el.fontFamily ?? "Syne"}
            color={el.color ?? "#ffffff"}
            side={side}
            x={t.x}
            y={t.y}
            rotation={t.rotation}
            scale={t.scale}
            order={el.order}
            selected={isSelected}
          />
        );
      case "image":
        return (
          <ImageDecal
            key={el.id}
            id={el.id}
            url={el.url!}
            side={side}
            x={t.x}
            y={t.y}
            rotation={t.rotation}
            scale={t.scale}
            opacity={el.opacity ?? 1}
            order={el.order}
            selected={isSelected}
          />
        );
    }
  };

  const renderGizmo = (el: (typeof elements)[0], side: "front" | "back") => {
    if (el.id !== selectedId || activeSide !== side || el.locked) return null;
    const t = el.transform;
    return (
      <ElementGizmo
        key={`gizmo-${el.id}`}
        x={t.x}
        y={t.y}
        rotationZ={t.rotation}
        elementScale={t.scale}
        side={side}
        scaleMax={el.kind === "text" ? 0.8 : 3}
        onTransform={(next) => {
          updateElement(el.id, {
            transform: {
              x: next.x,
              y: next.y,
              rotation: next.rotation ?? t.rotation,
              scale: next.scale ?? t.scale,
            },
          });
        }}
      />
    );
  };

  return (
    <group>
      <group ref={boardGroupRef} dispose={null}>
        {/* Edge */}
        <mesh castShadow receiveShadow geometry={nodes.Edge.geometry} renderOrder={0}>
          <meshStandardMaterial
            color={edgeColor}
            roughness={0.58}
            metalness={0.24}
            envMapIntensity={1.15}
          />
        </mesh>

        {/* Front face */}
        <mesh receiveShadow geometry={nodes.Front.geometry} renderOrder={0}>
          <meshStandardMaterial
            color={boardColor}
            roughness={boardRoughness}
            metalness={boardMetalness}
            envMapIntensity={1.25}
          />
          {frontElements.map((el) => renderDecal(el, el.id === selectedId, "front"))}
        </mesh>

        {/* Front gizmos — only when front is active AND camera faces front */}
        {showGizmos && activeSide === "front" &&
          frontElements.map((el) => renderGizmo(el, "front"))}

        {/* Back face */}
        <mesh castShadow receiveShadow geometry={nodes.Back.geometry} renderOrder={0}>
          <meshStandardMaterial
            color={boardColor}
            roughness={boardRoughness}
            metalness={boardMetalness}
            envMapIntensity={1.25}
          />
          {backElements.map((el) => renderDecal(el, el.id === selectedId, "back"))}
        </mesh>

        {/* Back gizmos — only when back is active AND camera faces back */}
        {showGizmos && activeSide === "back" &&
          backElements.map((el) => renderGizmo(el, "back"))}
      </group>
    </group>
  );
}

useGLTF.preload(BOARD_MODEL_URL);
