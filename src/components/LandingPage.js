import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LandingPage = ({ onStart }) => {
  const [currentQuote, setCurrentQuote] = useState(0);
  
  const quotes = [
    "Understanding plant growth through environmental factors",
    "Simulating photosynthesis with realistic 3D visualization", 
    "Discovering the science behind climate impact on crops",
    "Exploring the future of sustainable agriculture"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white overflow-hidden">
      {/* Hero Section */}
      <motion.div
        className="relative min-h-screen flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <defs>
              <pattern id="hexagons" x="0" y="0" width="10" height="8.66" patternUnits="userSpaceOnUse">
                <polygon points="5,0 9.33,2.5 9.33,6.16 5,8.66 0.67,6.16 0.67,2.5" 
                         fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexagons)" />
          </svg>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 text-center z-10">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Logo/Icon */}
            <div className="mb-8">
              <motion.div
                className="w-24 h-24 mx-auto bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-4xl mb-4"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                🌱
              </motion.div>
            </div>

            {/* Title */}
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-green-400 via-emerald-500 to-blue-500 bg-clip-text text-transparent">
              PhotoSynth
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-4 font-light">
              Intelligent Photosynthesis Limiting Factors Simulator
            </p>

            {/* Dynamic Tagline */}
            <motion.div
              key={currentQuote}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="h-16 flex items-center justify-center mb-8"
            >
              <p className="text-lg text-emerald-400 italic">
                {quotes[currentQuote]}
              </p>
            </motion.div>

            {/* Feature Highlights */}
            <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
              <motion.div
                className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-3xl mb-3">🧬</div>
                <h3 className="text-xl font-semibold mb-2 text-green-400">Real Biology</h3>
                <p className="text-gray-400 text-sm">
                  Law of Limiting Factors with realistic enzyme kinetics and environmental responses
                </p>
              </motion.div>

              <motion.div
                className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="text-3xl mb-3">🌿</div>
                <h3 className="text-xl font-semibold mb-2 text-emerald-400">3D Plant Growth</h3>
                <p className="text-gray-400 text-sm">
                  Watch plants grow and respond in real-time 3D visualization using Three.js
                </p>
              </motion.div>

              <motion.div
                className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="text-3xl mb-3">🧠</div>
                <h3 className="text-xl font-semibold mb-2 text-blue-400">AI Insights</h3>
                <p className="text-gray-400 text-sm">
                  Intelligent explanations and recommendations based on environmental factors
                </p>
              </motion.div>
            </div>

            {/* Action Button */}
            <div className="flex justify-center mb-8">
              <motion.button
                className="px-12 py-5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-green-500/30 transition-all duration-300 border-2 border-green-400/20 hover:border-green-400/40"
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 0 40px rgba(34, 197, 94, 0.5)",
                  y: -2
                }}
                whileTap={{ scale: 0.98 }}
                onClick={onStart}
              >
                🚀 Start Simulation
              </motion.button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto text-center">
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
                <div className="text-2xl font-bold text-green-400">6+</div>
                <div className="text-sm text-gray-400">Real Scenarios</div>
              </div>
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
                <div className="text-2xl font-bold text-emerald-400">3D</div>
                <div className="text-sm text-gray-400">Plant Models</div>
              </div>
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
                <div className="text-2xl font-bold text-blue-400">30</div>
                <div className="text-sm text-gray-400">Day Simulation</div>
              </div>
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
                <div className="text-2xl font-bold text-purple-400">∞</div>
                <div className="text-sm text-gray-400">Learning</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 text-green-400 text-6xl opacity-20"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🍃
        </motion.div>

        <motion.div
          className="absolute bottom-20 right-10 text-emerald-400 text-5xl opacity-20"
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -15, 0]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          🌿
        </motion.div>

        <motion.div
          className="absolute top-1/2 right-20 text-blue-400 text-4xl opacity-20"
          animate={{ 
            x: [0, 10, 0],
            y: [0, -10, 0]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          💨
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LandingPage;