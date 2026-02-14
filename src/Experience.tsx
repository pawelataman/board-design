import { OrbitControls } from "@react-three/drei";
import Ground from "./Ground";
import { Perf } from "r3f-perf";
export default function Experience() {
  return (
    <>
      <Perf position="top-left" />
      <directionalLight position={[0, 2, 0]} intensity={5.0} />

      <OrbitControls target={[0, 1, 0]} />
      <Ground />
    </>
  );
}
