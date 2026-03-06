export default function Ground() {
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={-0.01}>
      <planeGeometry args={[100, 100, 2, 2]} />
      <meshBasicMaterial color="white" />
    </mesh>
  );
}
