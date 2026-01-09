import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';

/**
 * PlantVisual Component
 * 
 * PERSON 2 - UI/Animation Engineer
 * 
 * Consolidated 3D plant visualization component
 * Shows plant growth and stress through:
 * - Scale/height changes based on photosynthesis rate
 * - Color changes based on stress level (green → yellow → brown)
 * - Real-time visual feedback
 */

function PlantModel({ photosynthesisRate = 0.5, stressLevel = 0 }) {
  const { scene } = useGLTF('/models/plant.glb');

  // Normalize values
  const growth = Math.max(0, Math.min(1, photosynthesisRate));
  const stress = Math.max(0, Math.min(1, stressLevel));

  // Apply visual effects
  const baseScale = 50.0; // Scale for visible 3D model

  // Growth affects vertical scale
  scene.scale.set(
    baseScale,
    baseScale * (0.8 + growth * 0.6), // Vertical growth (Y-axis)
    baseScale
  );

  // Position centered
  scene.position.set(0, 0, 0);

  // Stress color progression: Green → Yellow → Brown
  scene.traverse((child) => {
    if (child.isMesh && child.material) {
      const hue = 0.33 - stress * 0.15; // 0.33 is green, decreases toward yellow/brown
      const saturation = 1 - stress * 0.3;
      const lightness = 0.4 + growth * 0.2;

      child.material.color.setHSL(hue, saturation, lightness);
    }
  });

  return <primitive object={scene} />;
}

const PlantVisual = ({
  photosynthesisRate = 0.5,
  stressLevel = 0,
  limitingFactor = 'None',
  plantHealth = 85
}) => {
  // Convert plant health to stress level
  const normalizedStress = (100 - plantHealth) / 100;

  return (
    <motion.div
      className="w-full h-[500px] bg-gradient-to-b from-slate-900 to-slate-800 rounded-xl overflow-hidden border border-slate-700 relative shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Canvas
        camera={{
          position: [0, 3, 8], // Close-up camera position
          fov: 65,
          near: 0.1,
          far: 200
        }}
        shadows
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance'
        }}
      >
        {/* Lighting Setup */}
        <ambientLight intensity={0.8} />
        <directionalLight
          position={[0, 2.5, 3]}
          intensity={1}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />

        {/* Environment Background */}
        <Environment preset="sunset" background={false} />

        {/* Ground/Soil */}
        <mesh position={[0, -15, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[60, 60]} />
          <meshStandardMaterial color="#2D1810" roughness={0.9} />
        </mesh>

        {/* Plant Model - with growth and stress visualization */}
        <PlantModel photosynthesisRate={photosynthesisRate} stressLevel={normalizedStress} />

        {/* Orbit Controls - allows user to rotate plant */}
        <OrbitControls
          target={[0, 0, 0]}
          enableRotate={true}
          enableZoom={false}
          autoRotate={true}
          autoRotateSpeed={2}
          dampingFactor={0.05}
          minDistance={5}
          maxDistance={15}
        />
      </Canvas>

      {/* Status Overlay - Bottom Left */}
      <motion.div
        className="absolute bottom-4 left-4 bg-slate-900 bg-opacity-80 backdrop-blur-sm border border-slate-600 rounded-lg p-3 text-white text-sm max-w-xs"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-400">Health:</span>
            <span className="font-bold">{Math.round(plantHealth)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Growth:</span>
            <span className="font-bold text-green-400">{(photosynthesisRate * 100).toFixed(0)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Stress:</span>
            <span className="font-bold text-red-400">{(normalizedStress * 100).toFixed(0)}%</span>
          </div>
        </div>
      </motion.div>

      {/* Limiting Factor Alert - Top Right */}
      {limitingFactor && limitingFactor !== 'None' && (
        <motion.div
          className="absolute top-4 right-4 bg-yellow-500 bg-opacity-90 backdrop-blur-sm rounded-lg px-4 py-2 text-slate-900 font-bold text-sm shadow-lg"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          ⚠️ Limiting: {limitingFactor}
        </motion.div>
      )}

      {/* Growth Indicator - Center Top */}
      <motion.div
        className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white text-center"
        animate={{
          y: [0, -10, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity
        }}
      >
        <div className="text-3xl mb-1">
          {photosynthesisRate > 0.7 ? '📈' : photosynthesisRate > 0.4 ? '➡️' : '📉'}
        </div>
        <p className="text-xs text-gray-300 font-semibold">
          {photosynthesisRate > 0.7 ? 'Thriving' : photosynthesisRate > 0.5 ? 'Stable' : photosynthesisRate > 0.3 ? 'Stressed' : 'Dying'}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default PlantVisual;
