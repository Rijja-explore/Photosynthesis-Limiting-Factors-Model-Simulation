import React from 'react';
import { motion } from 'framer-motion';

const ScenarioSelector = ({ currentScenario, onScenarioChange }) => {
  const scenarios = [
    {
      id: 'optimal',
      title: 'Optimal Conditions',
      description: 'Perfect greenhouse environment',
      icon: '🌿',
      gradient: 'from-green-500 to-green-600',
      conditions: 'Light: 70% | CO₂: 400ppm | Temp: 25°C'
    },
    {
      id: 'climate2050',
      title: 'Climate Change 2050',
      description: 'Projected future atmospheric conditions',
      icon: '🌡️',
      gradient: 'from-red-500 to-orange-500',
      conditions: 'Light: 75% | CO₂: 500ppm | Temp: 32°C'
    },
    {
      id: 'drought',
      title: 'Drought Conditions',
      description: 'Water scarcity and heat stress',
      icon: '🏜️',
      gradient: 'from-yellow-600 to-orange-600',
      conditions: 'Light: 85% | CO₂: 380ppm | Temp: 38°C'
    },
    {
      id: 'greenhouse',
      title: 'Greenhouse Farming',
      description: 'Controlled agricultural environment',
      icon: '🏠',
      gradient: 'from-blue-500 to-blue-600',
      conditions: 'Light: 90% | CO₂: 600ppm | Temp: 26°C'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Real-World Scenarios</h2>
        <p className="text-gray-400">Experience different environmental conditions</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {scenarios.map((scenario, index) => (
          <motion.button
            key={scenario.id}
            className={`relative overflow-hidden rounded-xl p-4 text-left transition-all duration-300 ${
              currentScenario === scenario.id
                ? 'ring-2 ring-white ring-opacity-50 scale-105'
                : 'hover:scale-102'
            }`}
            style={{
              background: currentScenario === scenario.id
                ? `linear-gradient(135deg, var(--tw-gradient-stops))`
                : 'rgb(30, 41, 59)'
            }}
            onClick={() => onScenarioChange(scenario.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Background gradient overlay */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${scenario.gradient} opacity-0`}
              animate={{
                opacity: currentScenario === scenario.id ? 0.2 : 0
              }}
              transition={{ duration: 0.3 }}
            />

            <div className="relative z-10 flex items-start gap-4">
              <motion.div
                className="text-3xl"
                animate={{
                  scale: currentScenario === scenario.id ? [1, 1.1, 1] : 1,
                  rotate: currentScenario === scenario.id ? [0, 5, -5, 0] : 0
                }}
                transition={{
                  duration: currentScenario === scenario.id ? 2 : 0,
                  repeat: currentScenario === scenario.id ? Infinity : 0,
                  ease: "easeInOut"
                }}
              >
                {scenario.icon}
              </motion.div>
              
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">
                  {scenario.title}
                </h3>
                <p className="text-sm text-gray-300 mb-2">
                  {scenario.description}
                </p>
                <div className="text-xs text-gray-400 font-mono">
                  {scenario.conditions}
                </div>
              </div>

              {currentScenario === scenario.id && (
                <motion.div
                  className="flex items-center justify-center w-8 h-8 bg-white bg-opacity-20 rounded-full"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                >
                  <span className="text-white font-bold">✓</span>
                </motion.div>
              )}
            </div>

            {/* Hover effect */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${scenario.gradient} opacity-0`}
              whileHover={{ opacity: currentScenario !== scenario.id ? 0.1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        ))}
      </div>

      {/* Scenario Impact Info */}
      <motion.div
        key={currentScenario}
        className="bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-700"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
          <span>📊</span>
          Scenario Impact
        </h4>
        
        {currentScenario === 'climate2050' && (
          <div className="text-sm text-gray-300 space-y-1">
            <p>• Elevated CO₂ partially offsets temperature stress</p>
            <p>• Heat stress becomes the primary limiting factor</p>
            <p>• Plant survival strategies shift to conservation mode</p>
          </div>
        )}
        
        {currentScenario === 'drought' && (
          <div className="text-sm text-gray-300 space-y-1">
            <p>• Extreme temperature severely limits enzyme function</p>
            <p>• High light intensity increases thermal stress</p>
            <p>• Plant enters survival mode, halting growth</p>
          </div>
        )}
        
        {currentScenario === 'greenhouse' && (
          <div className="text-sm text-gray-300 space-y-1">
            <p>• Enhanced CO₂ levels boost photosynthetic capacity</p>
            <p>• Controlled temperature optimizes enzyme activity</p>
            <p>• Superior growing conditions exceed natural rates</p>
          </div>
        )}
        
        {currentScenario === 'optimal' && (
          <div className="text-sm text-gray-300 space-y-1">
            <p>• Balanced conditions for steady, healthy growth</p>
            <p>• Natural atmospheric composition</p>
            <p>• Moderate environmental stress promotes resilience</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ScenarioSelector;