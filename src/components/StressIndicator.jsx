import React from 'react';
import { motion } from 'framer-motion';

/**
 * StressIndicator Component
 * 
 * PERSON 2 - UI/Animation Engineer
 * 
 * Shows plant health status with animated visual feedback
 * Health transitions through color spectrum: green → yellow → orange → red
 * Includes animated heartbeat effect on stress
 */

const StressIndicator = ({ plantHealth = 85, limitingFactor = 'None' }) => {
  // Determine stress level (inverse of health)
  const stressLevel = 100 - plantHealth;

  // Get color and status based on health
  const getHealthStyle = (health) => {
    if (health > 80) {
      return {
        color: 'from-green-400 to-emerald-500',
        text: 'Thriving',
        icon: '🌟',
        bgLight: 'bg-green-50',
        borderColor: 'border-green-300',
        barColor: 'bg-green-500',
        textColor: 'text-green-700'
      };
    } else if (health > 60) {
      return {
        color: 'from-yellow-300 to-lime-400',
        text: 'Stable',
        icon: '🌱',
        bgLight: 'bg-yellow-50',
        borderColor: 'border-yellow-300',
        barColor: 'bg-yellow-500',
        textColor: 'text-yellow-700'
      };
    } else if (health > 30) {
      return {
        color: 'from-orange-400 to-yellow-500',
        text: 'Stressed',
        icon: '⚠️',
        bgLight: 'bg-orange-50',
        borderColor: 'border-orange-300',
        barColor: 'bg-orange-500',
        textColor: 'text-orange-700'
      };
    } else {
      return {
        color: 'from-red-500 to-pink-600',
        text: 'Dying',
        icon: '🆘',
        bgLight: 'bg-red-50',
        borderColor: 'border-red-300',
        barColor: 'bg-red-600',
        textColor: 'text-red-700'
      };
    }
  };

  const style = getHealthStyle(plantHealth);

  // Animation for stress heartbeat
  const pulseAnimation = stressLevel > 40 ? 'animate-pulse' : '';

  return (
    <motion.div
      className={`bg-white rounded-lg shadow-md p-6 border-2 ${style.borderColor} ${pulseAnimation}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header with Icon and Status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{style.icon}</span>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Plant Health</h3>
            <p className={`text-sm font-semibold ${style.textColor}`}>{style.text}</p>
          </div>
        </div>
      </div>

      {/* Health Percentage Display */}
      <div className="mb-4">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm text-gray-600">Health Status</span>
          <motion.span
            className={`text-3xl font-bold ${style.textColor}`}
            key={plantHealth}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {Math.round(plantHealth)}%
          </motion.span>
        </div>

        {/* Animated Health Bar */}
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
          <motion.div
            className={`h-full bg-gradient-to-r ${style.color}`}
            initial={{ width: 0 }}
            animate={{ width: `${plantHealth}%` }}
            transition={{ duration: 0.5, type: 'spring', damping: 10 }}
          />
        </div>
      </div>

      {/* Stress Level Indicator */}
      <div className="mb-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Stress Level</span>
          <span className="text-sm font-semibold text-gray-700">{Math.round(stressLevel)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-red-400 to-red-600"
            initial={{ width: 0 }}
            animate={{ width: `${stressLevel}%` }}
            transition={{ duration: 0.5, type: 'spring', damping: 10 }}
          />
        </div>
      </div>

      {/* Limiting Factor Alert */}
      {limitingFactor && limitingFactor !== 'None' && (
        <motion.div
          className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-sm font-semibold text-yellow-800">
            ⚠️ Limiting Factor: <span className="font-bold">{limitingFactor}</span>
          </p>
        </motion.div>
      )}

      {/* Health Status Details */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-gray-600">Status</p>
            <p className={`font-semibold ${style.textColor}`}>{style.text}</p>
          </div>
          <div>
            <p className="text-gray-600">Trend</p>
            <p className="font-semibold text-gray-700">
              {stressLevel > 40 ? '📉 Declining' : stressLevel > 20 ? '➡️ Stable' : '📈 Improving'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StressIndicator;
