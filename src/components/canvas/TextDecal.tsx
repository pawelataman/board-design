import { Decal } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { CanvasTexture, Object3D, SRGBColorSpace } from "three";
import { useDesignStore } from "../../store/useDesignStore";

const FONT_MAP: Record<string, string> = {
  Syne: '700 170px "Syne"',
  "Space Grotesk": '700 170px "Space Grotesk"',
  Inter: '700 170px "Inter"',
};

interface TextDecalProps {
  id: string;
  text: string;
  fontFamily: string;
  color: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  order: number;
  selected: boolean;
}

export default function TextDecal({
  id,
  text,
  fontFamily,
  color,
  x,
  y,
  rotation,
  scale,
  order,
  selected,
}: TextDecalProps) {
  const gl = useThree((state) => state.gl);
  const select = useDesignStore((state) => state.select);
  const boardRoughness = useDesignStore((state) => state.board.roughness);
  const boardMetalness = useDesignStore((state) => state.board.metalness);

  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 320;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Flip horizontally to counteract the parent group's 180° Z rotation
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.font = FONT_MAP[fontFamily] ?? FONT_MAP.Syne;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = color;
    ctx.shadowColor = "rgba(7,15,29,0.35)";
    ctx.shadowBlur = 20;
    ctx.fillText(text.slice(0, 24), canvas.width / 2, canvas.height / 2 + 8);
    ctx.restore();

    const t = new CanvasTexture(canvas);
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = gl.capabilities.getMaxAnisotropy();
    t.needsUpdate = true;
    return t;
  }, [color, fontFamily, gl.capabilities, text]);

  useEffect(() => () => texture?.dispose(), [texture]);

  const handlePointerDown = (event: ThreeEvent<MouseEvent>) => {
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

  if (!texture) return null;

  // Higher order = renders on top (drawn later with renderOrder)

  return (
    <Decal
      position={[x, y, 0.04]}
      rotation={[0, 0, rotation]}
      scale={[scale * 3.1, scale * 1.15, 0.18]}
      renderOrder={order}
      onPointerDown={handlePointerDown}
    >
      <meshStandardMaterial
        map={texture}
        transparent
        opacity={1}
        emissive={selected ? "#7dd3fc" : "#000000"}
        emissiveIntensity={selected ? 0.3 : 0}
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
