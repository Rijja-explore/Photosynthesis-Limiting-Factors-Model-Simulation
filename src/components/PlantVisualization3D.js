import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei';
import * as THREE from 'three';

// REALISTIC GLTF PLANT MODEL - CENTERED AND CLEARLY VISIBLE
function PlantModel({ photosynthesisRate, stressLevel }) {
  const { scene } = useGLTF("/models/plant.glb");
  const plantRef = useRef();

  // Normalized values from simulation
  const growth = Math.max(0, Math.min(1, photosynthesisRate / 100));
  const stress = Math.max(0, Math.min(1, stressLevel / 100));

  // Base overall scale for screen-filling visibility
  const baseScale = 5.0; // much larger to fit screen

  // Apply visual effects once per render
  // Uniform X/Z scale for size, Y scale for growth
  scene.scale.set(
    baseScale,
    baseScale * (0.8 + growth * 0.6),
    baseScale
  );

  // Position plant ON the ground plane (not floating)
  scene.position.set(0, -1.6, 0); // match ground plane position

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
  return <primitive ref={plantRef} object={scene} />;
}

// CLEAN STATUS DISPLAY
function PlantStatusDisplay({ photosynthesisRate, stressLevel }) {
  const getStatus = (rate) => {
    if (rate > 80) return { label: 'Thriving', color: '#22C55E', icon: '🌿' };
    if (rate > 60) return { label: 'Healthy', color: '#84CC16', icon: '🌱' };
    if (rate > 40) return { label: 'Stressed', color: '#EAB308', icon: '⚠️' };
    return { label: 'Dying', color: '#EF4444', icon: '🥀' };
  };

  const status = getStatus(photosynthesisRate);

  return (
    <Html position={[0, 2, 0]} center>
      <div className="bg-black/90 backdrop-blur-sm rounded-lg px-4 py-3 border border-gray-600">
        <div className="flex items-center gap-3 text-white">
          <span className="text-xl">{status.icon}</span>
          <div>
            <div className="font-bold text-lg" style={{ color: status.color }}>
              {status.label}
            </div>
            <div className="text-sm text-gray-300">
              Rate: {photosynthesisRate.toFixed(0)}%
            </div>
          </div>
        </div>
      </div>
    </Html>
  );
}

// MAIN COMPONENT - CLEAN AND FOCUSED
const PlantVisualization3D = ({ 
  environmentalFactors, 
  plantHealth, 
  photosynthesisRate,
  limitingFactor 
}) => {
  const { light, co2, temperature } = environmentalFactors;
  const stressLevel = 100 - plantHealth;
  
  return (
    <div className="w-full h-[500px] bg-gradient-to-b from-slate-900 to-slate-800 rounded-xl overflow-hidden border border-slate-700 relative">
      <Canvas
        camera={{ 
          position: [0, 0, 4], // Front view, further back to see full large plant
          fov: 50,
          near: 0.1,
          far: 100
        }}
        shadows
        gl={{ 
          antialias: true,
          alpha: false,
          powerPreference: "high-performance"
        }}
      >
        {/* FRONT-VIEW OPTIMIZED LIGHTING */}
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[0, 3, 4]} // from front-top
          intensity={1}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />

        {/* ENVIRONMENT */}
        <Environment preset="sunset" background={false} />
        
        {/* SOIL GROUND */}
        <mesh 
          position={[0, -1.6, 0]} 
          rotation={[-Math.PI / 2, 0, 0]} 
          receiveShadow
        >
          <planeGeometry args={[6, 6]} />
          <meshStandardMaterial color="#2D1810" roughness={0.9} />
        </mesh>

        {/* CONTACT SHADOWS */}
        <ContactShadows
          position={[0, -1.59, 0]}
          scale={4}
          far={2}
          blur={1}
          opacity={0.5}
        />

        {/* THE REALISTIC GLTF PLANT */}
        <PlantModel
          photosynthesisRate={photosynthesisRate}
          stressLevel={stressLevel}
        />

        {/* PLANT STATUS */}
        <PlantStatusDisplay
          photosynthesisRate={photosynthesisRate}
          stressLevel={stressLevel}
        />

        {/* ORBIT CONTROLS - FRONT VIEW WITH ZOOM FOR LARGE PLANT */}
        <OrbitControls
          enableRotate={true}
          enableZoom={true}
          enablePan={false}
          target={[0, -0.5, 0]} // target the plant on the ground plane
          minDistance={2} // allow close zoom
          maxDistance={8} // allow zoom out to see full plant
          maxPolarAngle={Math.PI / 2.1} // prevent going under ground
          minPolarAngle={Math.PI / 6} // reasonable top view limit
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>

      {/* CLEAN GROWTH INDICATOR */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-gray-600">
        <div className="text-white text-sm font-semibold mb-2">Plant Growth</div>
        <div className="flex items-center gap-2">
          <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-500"
              style={{ width: `${Math.max(5, photosynthesisRate)}%` }}
            />
          </div>
          <span className="text-gray-300 text-xs">
            {photosynthesisRate > 80 ? 'Mature' :
             photosynthesisRate > 60 ? 'Growing' :
             photosynthesisRate > 40 ? 'Young' :
             photosynthesisRate > 20 ? 'Seedling' : 'Struggling'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlantVisualization3D;