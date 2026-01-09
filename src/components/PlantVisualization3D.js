import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';

// REALISTIC GLTF PLANT MODEL - CENTERED AND CLEARLY VISIBLE
function PlantModel({ photosynthesisRate, stressLevel }) {
  const { scene } = useGLTF("/models/plant.glb");

  // Normalize values - photosynthesisRate is already 0-1 from logic
  // If it comes as percentage (0-100), convert it
  const rate = photosynthesisRate > 1 ? photosynthesisRate / 100 : photosynthesisRate;
  const growth = Math.max(0, Math.min(1, rate));
  const stress = Math.max(0, Math.min(1, stressLevel));

  // Make the plant ULTRA-FOCUSED - extreme close-up
  const baseScale = 50.0; // Maximum scale for ultra-close plant focus

  // Apply visual effects once per render
  // Uniform X/Z scale for size, Y scale for growth
  scene.scale.set(
    baseScale,
    baseScale * (0.8 + growth * 0.6),
    baseScale
  );

  // Position plant at center, visible in camera view
  scene.position.set(0, 0, 0); // Center origin for best visibility

  // Stress colour progression: green  yellow  brown
  scene.traverse((child) => {
    if (child.isMesh && child.material) {
      const hue = 0.33 - stress * 0.15; // 0.33 is green
      const saturation = 1 - stress * 0.3;
      const lightness = 0.4 + growth * 0.2;

      child.material.color.setHSL(hue, saturation, lightness);
    }
  });

  // Return plant centered and grounded
  return <primitive object={scene} />;
}

// CLEAN STATUS DISPLAY - REMOVED Html COMPONENT TO USE BOTTOM POSITIONING

// MAIN COMPONENT - CLEAN AND FOCUSED
const PlantVisualization3D = ({ 
  environmentalFactors, 
  plantHealth = 85,
  photosynthesisRate = 0.5,
  limitingFactor = 'None'
}) => {
  // Convert plant health (0-100) to stress level (0-1)
  const stressLevel = (100 - plantHealth) / 100;
  
  // Ensure photosynthesis rate is in 0-1 range
  const normalizedRate = photosynthesisRate > 1 ? photosynthesisRate / 100 : photosynthesisRate;
  
  return (
    <div className="w-full h-[500px] bg-gradient-to-b from-slate-900 to-slate-800 rounded-xl overflow-hidden border border-slate-700 relative">
      <Canvas
        camera={{ 
          position: [0, 3, 8], // Ultra-close for maximum plant focus
          fov: 65, // Wide FOV for close-up plant details
          near: 0.1,
          far: 200
        }}
        shadows
        gl={{ 
          antialias: true,
          alpha: false,
          powerPreference: "high-performance"
        }}
      >
        {/* CLOSE-UP HERO VIEW LIGHTING */}
        <ambientLight intensity={0.8} />
        <directionalLight
          position={[0, 2.5, 3]} // softer light for close camera
          intensity={1}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />

        {/* ENVIRONMENT */}
        <Environment preset="sunset" background={false} />
        
        {/* SOIL GROUND */}
        <mesh 
          position={[0, -15, 0]} // Ground well below the massive plant base
          rotation={[-Math.PI / 2, 0, 0]} 
          receiveShadow
        >
          <planeGeometry args={[60, 60]} />
          <meshStandardMaterial color="#2D1810" roughness={0.9} />
        </mesh>

        {/* THE REALISTIC GLTF PLANT */}
        <PlantModel
          photosynthesisRate={normalizedRate}
          stressLevel={stressLevel}
        />

        {/* PLANT-FOCUSED ORBIT CONTROLS - NO DRIFTING */}
        <OrbitControls
          target={[0, 0, 0]} // plant center at origin - camera orbits around plant
          enableRotate={true}
          enableZoom={true}
          enablePan={false} // CRITICAL - no drifting away
          minDistance={5} // extremely close zoom for plant details
          maxDistance={15} // moderate zoom out for ultra-focused view
          minPolarAngle={Math.PI / 3} // prevent bad top angles
          maxPolarAngle={Math.PI / 2.1} // prevent going under ground
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>

      {/* PLANT STATUS INDICATOR */}
      <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-gray-600">
        <div className="flex items-center gap-3 text-white">
          <span className="text-xl">
            {normalizedRate > 0.7 ? '🌿' : normalizedRate > 0.6 ? '🌱' : normalizedRate > 0.4 ? '⚠️' : '🥀'}
          </span>
          <div>
            <div className="font-bold text-lg" style={{ 
              color: normalizedRate > 0.7 ? '#22C55E' : normalizedRate > 0.6 ? '#84CC16' : normalizedRate > 0.4 ? '#EAB308' : '#EF4444' 
            }}>
              {normalizedRate > 0.7 ? 'Thriving' : normalizedRate > 0.6 ? 'Stable' : normalizedRate > 0.4 ? 'Stressed' : 'Dying'}
            </div>
            <div className="text-sm text-gray-300">
              Rate: {(normalizedRate * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      </div>

      {/* CLEAN GROWTH INDICATOR */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-gray-600">
        <div className="text-white text-sm font-semibold mb-2">Plant Growth</div>
        <div className="flex items-center gap-2">
          <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-500"
              style={{ width: `${Math.max(5, normalizedRate * 100)}%` }}
            />
          </div>
          <span className="text-gray-300 text-xs">
            {normalizedRate > 0.8 ? 'Thriving' :
             normalizedRate > 0.6 ? 'Stable' :
             normalizedRate > 0.4 ? 'Stressed' :
             normalizedRate > 0.2 ? 'Struggling' : 'Dying'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlantVisualization3D;