import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RecommendationEngine = ({ recommendations, currentHealth }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'from-red-500 to-red-600';
      case 'high': return 'from-orange-500 to-orange-600';
      case 'medium': return 'from-yellow-500 to-yellow-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '💡';
      default: return 'ℹ️';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Smart Recommendations</h2>
        <p className="text-gray-400">AI-powered optimization suggestions</p>
      </div>

      {/* Health Status */}
      <motion.div
        className="bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-700"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            className={`text-2xl`}
            animate={{
              scale: currentHealth < 50 ? [1, 1.2, 1] : 1,
              rotate: currentHealth < 30 ? [0, 5, -5, 0] : 0
            }}
            transition={{ duration: 0.5, repeat: currentHealth < 50 ? Infinity : 0 }}
          >
            {currentHealth > 80 ? '🌟' : currentHealth > 60 ? '🌱' : currentHealth > 30 ? '⚠️' : '🆘'}
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-white">Plant Status</h3>
            <p className={`text-sm font-medium ${
              currentHealth > 80 ? 'text-green-400' :
              currentHealth > 60 ? 'text-yellow-400' :
              currentHealth > 30 ? 'text-orange-400' :
              'text-red-400'
            }`}>
              {currentHealth > 80 ? 'Thriving' :
               currentHealth > 60 ? 'Stable' :
               currentHealth > 30 ? 'Stressed' :
               'Dying'}
            </p>
          </div>
        </div>
        
        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
          <motion.div
            className={`h-full ${
              currentHealth > 80 ? 'bg-gradient-to-r from-green-400 to-green-500' :
              currentHealth > 60 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
              currentHealth > 30 ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
              'bg-gradient-to-r from-red-400 to-red-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${currentHealth}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* Recommendations List */}
      <AnimatePresence>
        {recommendations.length > 0 ? (
          <motion.div className="space-y-4">
            {recommendations.map((rec, index) => (
              <motion.div
                key={`${rec.action}-${index}`}
                className={`bg-gradient-to-br ${getPriorityColor(rec.priority)} p-1 rounded-xl shadow-lg`}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="bg-slate-800 rounded-lg p-4 h-full">
                  <div className="flex items-start gap-3 mb-3">
                    <motion.span
                      className="text-xl"
                      animate={{
                        scale: rec.priority === 'critical' ? [1, 1.2, 1] : 1
                      }}
                      transition={{ duration: 1, repeat: rec.priority === 'critical' ? Infinity : 0 }}
                    >
                      {getPriorityIcon(rec.priority)}
                    </motion.span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-white text-sm">Recommended Action</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                          rec.priority === 'critical' ? 'bg-red-900 text-red-200' :
                          rec.priority === 'high' ? 'bg-orange-900 text-orange-200' :
                          rec.priority === 'medium' ? 'bg-yellow-900 text-yellow-200' :
                          'bg-blue-900 text-blue-200'
                        }`}>
                          {rec.priority}
                        </span>
                      </div>
                      <p className="text-gray-200 mb-3 font-medium">
                        {rec.action}
                      </p>
                      <div className="bg-slate-700 p-3 rounded-lg">
                        <p className="text-sm text-gray-300 mb-1">
                          <span className="font-semibold text-green-400">Expected Impact:</span>
                        </p>
                        <p className="text-sm text-gray-200">
                          {rec.impact}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="text-6xl mb-4"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              🌟
            </motion.div>
            <h3 className="text-xl font-bold text-green-400 mb-2">
              Perfect Conditions!
            </h3>
            <p className="text-gray-300">
              Your plant is thriving. All environmental factors are optimally balanced for maximum photosynthetic efficiency.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Tips */}
      <motion.div
        className="bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span>💡</span>
          Pro Tips
        </h4>
        <div className="space-y-2 text-sm text-gray-300">
          <div className="flex items-start gap-2">
            <span className="text-green-400 font-bold">•</span>
            <span>Temperature has the most dramatic impact on plant health</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-400 font-bold">•</span>
            <span>CO₂ levels plateau at 800ppm - more isn't always better</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-yellow-400 font-bold">•</span>
            <span>Light intensity below 30% severely limits photosynthesis</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RecommendationEngine;