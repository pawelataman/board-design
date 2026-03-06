import {
  ContactShadows,
  GizmoHelper,
  GizmoViewport,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import Ground from "./Ground";
import { Perf } from "r3f-perf";
import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import { Object3D, MeshStandardMaterial, Mesh } from "three";
export default function Experience() {
  const dounut = useGLTF("./models/snowboard.glb");
  const boardRef = useRef<Object3D>(null);

  useMemo(() => {
    const redMaterial = new MeshStandardMaterial({
      color: "white",
      roughness: 0.5,
      metalness: 0.2,
    });
    dounut.scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.material = redMaterial;
      }
    });
  }, [dounut.scene]);

  useFrame(() => {
    // if (boardRef.current) {
    //   boardRef.current.rotation.y += 0.001;
    //   boardRef.current.rotation.x += 0.005;
    // }
  });

  return (
    <>
      <Perf position="top-left" />
      <directionalLight position={[0, 2, 2]} intensity={1.0} />
      <ambientLight intensity={0.5} />
      <GizmoHelper
        alignment="bottom-right" // widget alignment within scene
        margin={[80, 80]} // widget margins (X, Y)
      >
        <GizmoViewport
          axisColors={["red", "green", "blue"]}
          labelColor="black"
        />
        {/* alternative: <GizmoViewcube /> */}
      </GizmoHelper>
      <primitive
        ref={boardRef}
        object={dounut.scene}
        position-y={2}
        scale={[0.55, 0.5, 0.5]}
      />
      <ContactShadows
        position={[0, 0, 0]}
        opacity={1}
        scale={10}
        blur={1}
        far={3}
      />

      <OrbitControls target={[0, 1.75, 0]} />
      <Ground />
    </>
  );
}
