import React from 'react';
import { motion } from 'framer-motion';

/**
 * ModeToggle Component
 * 
 * PERSON 2 - UI/Animation Engineer
 * 
 * Toggles between Learning Mode and Experiment Mode
 * Learning Mode: Shows step-by-step guidance and explanations
 * Experiment Mode: Free exploration without hints
 */

const ModeToggle = ({ isLearningMode = true, onToggle }) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Simulation Mode</h2>

      {/* Mode Description */}
      <p className="text-gray-600 mb-6">
        {isLearningMode
          ? '📚 Learning Mode: Get step-by-step guidance and scientific explanations as you adjust environmental factors.'
          : '🔬 Experiment Mode: Free exploration - discover the relationships between factors and photosynthesis rate on your own.'}
      </p>

      {/* Toggle Button with Animation */}
      <div className="flex gap-4">
        <motion.button
          onClick={() => onToggle && onToggle()}
          className={`flex-1 px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${
            isLearningMode
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLearningMode ? '📚 Learning Mode' : '🔬 Experiment Mode'}
        </motion.button>
      </div>

      {/* Mode Info Cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Learning Mode Card */}
        <motion.div
          className={`p-4 rounded-lg border-2 transition-all ${
            isLearningMode ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
          }`}
          animate={isLearningMode ? { scale: 1.02 } : { scale: 1 }}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">📚</span>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-1">Learning Mode</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✓ Scientific explanations</li>
                <li>✓ Limiting factor hints</li>
                <li>✓ Recommendations shown</li>
                <li>✓ Educational focus</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Experiment Mode Card */}
        <motion.div
          className={`p-4 rounded-lg border-2 transition-all ${
            !isLearningMode ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-gray-50'
          }`}
          animate={!isLearningMode ? { scale: 1.02 } : { scale: 1 }}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔬</span>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-1">Experiment Mode</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✓ No guided explanations</li>
                <li>✓ Discover relationships</li>
                <li>✓ Challenge yourself</li>
                <li>✓ Research-focused</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Current Mode Indicator */}
      <motion.div
        className="mt-6 p-4 rounded-lg bg-gradient-to-r from-indigo-100 to-blue-100 border border-indigo-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-sm text-indigo-900 font-semibold text-center">
          {isLearningMode
            ? '🎓 You are in Learning Mode - Guidance enabled'
            : '🔬 You are in Experiment Mode - Free exploration'}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ModeToggle;
