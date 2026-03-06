import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Canvas camera={{ position: [0, 2, 5], fov: 45 }} shadows>
      <Experience />
    </Canvas>
  </StrictMode>,
);
