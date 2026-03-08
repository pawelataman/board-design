import { Decal, useTexture } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { Object3D, RepeatWrapping, type Texture } from "three";
import { useDesignStore } from "../../store/useDesignStore";

interface StickerDecalProps {
  id: string;
  url: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
  order: number;
  selected: boolean;
}

export default function StickerDecal({
  id,
  url,
  x,
  y,
  rotation,
  scale,
  opacity,
  order,
  selected,
}: StickerDecalProps) {
  const sourceTexture = useTexture(url) as Texture;
  const select = useDesignStore((state) => state.select);
  const boardRoughness = useDesignStore((state) => state.board.roughness);
  const boardMetalness = useDesignStore((state) => state.board.metalness);

  const texture = useMemo(() => {
    const t = sourceTexture.clone();
    t.wrapS = RepeatWrapping;
    t.wrapT = RepeatWrapping;
    t.needsUpdate = true;
    return t;
  }, [sourceTexture]);

  useEffect(() => () => texture.dispose(), [texture]);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    // Among all intersected decal meshes, only the one with the highest
    // renderOrder (i.e. the topmost layer) should capture the event.
    const myMesh = event.eventObject;
    const topDecal = event.intersections.reduce<Object3D | null>(
      (best, hit) => {
        const obj = hit.eventObject;
        if (obj.renderOrder > 0 && (!best || obj.renderOrder > best.renderOrder))
          return obj;
        return best;
      },
      null,
    );
    if (topDecal && topDecal !== myMesh) return; // a higher-order decal will handle it
    event.stopPropagation();
    select(id);
  };

  // Higher order = renders on top (drawn later with renderOrder)

  return (
    <Decal
      position={[x, y, 0.04]}
      rotation={[0, 0, rotation]}
      scale={[scale, scale, 0.24]}
      renderOrder={order}
      onPointerDown={handleClick}
    >
      <meshStandardMaterial
        map={texture}
        transparent
        opacity={opacity}
        emissive={selected ? "#7dd3fc" : "#000000"}
        emissiveIntensity={selected ? 0.45 : 0}
        metalness={selected ? Math.max(boardMetalness, 0.18) : boardMetalness}
        roughness={selected ? Math.min(boardRoughness, 0.35) : boardRoughness}
        polygonOffset
        polygonOffsetFactor={-1}
        depthTest
        depthWrite={false}
      />
    </Decal>
  );
}
