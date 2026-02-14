import { useTexture } from "@react-three/drei";
import { RepeatWrapping, type Texture } from "three";

export default function Ground() {
  const groundTexture = useTexture(
    [
      "./textures/snow/snow_01_arm_1k.jpg",
      "./textures/snow/snow_01_diff_1k.jpg",
      "./textures/snow/snow_01_disp_1k.jpg",
      "./textures/snow/snow_01_nor_gl_1k.jpg",
      "./textures/snow/alpha.webp",
    ],
    (textures: Texture[]) => {
      textures.forEach((texture, index) => {
        texture.repeat.set(2, 2);
        texture.wrapS = texture.wrapT = RepeatWrapping;

        if (index === 4) {
          texture.repeat.set(1, 1);
        }
      });
    },
  );

  return (
    <mesh rotation-x={-Math.PI / 2}>
      <planeGeometry args={[10, 10, 128, 128]} />
      <meshStandardMaterial
        alphaMap={groundTexture[4]}
        aoMap={groundTexture[0]}
        roughnessMap={groundTexture[0]}
        metalnessMap={groundTexture[0]}
        map={groundTexture[1]}
        displacementMap={groundTexture[2]}
        displacementScale={0.1}
        normalMap={groundTexture[3]}
        transparent={true}
      />
    </mesh>
  );
}
