import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { useRef } from "react";

function PlantModel({ growth = 1, stress = 0 }) {
  const { scene } = useGLTF("/models/plant.glb");
  const plantRef = useRef();

  // FIX THE "STRETCHING POLE" PROBLEM - Critical pivot fix
  scene.position.y = 0.5; // Growth must happen upwards from soil, not from center

  // Smooth growth - vertical scaling only
  scene.scale.y = 0.8 + growth * 0.6;

  // Stress color progression (simple but effective)
  scene.traverse((child) => {
    if (child.isMesh) {
      child.material.color.setHSL(
        0.33 - stress * 0.1, // green → yellow → brown
        1,
        0.4
      );
    }
  });

  return <primitive ref={plantRef} object={scene} position={[0, 0, 0]} />;
}

export default function Plant3D({ growth, stress }) {
  return (
    <Canvas camera={{ position: [2, 2, 4], fov: 45 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <PlantModel growth={growth} stress={stress} />
      <OrbitControls enableZoom={false} enableRotate={false} />
    </Canvas>
  );
}