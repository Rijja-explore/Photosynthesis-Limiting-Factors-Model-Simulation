import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ExplanationPanel = ({ explanation, limitingFactor, factors }) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (explanation) {
      setIsTyping(true);
      setDisplayText('');
      
      let index = 0;
      const interval = setInterval(() => {
        if (index < explanation.length) {
          setDisplayText(explanation.slice(0, index + 1));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(interval);
        }
      }, 20);

      return () => clearInterval(interval);
    }
  }, [explanation]);

  const getBiologicalInsight = () => {
    const { light, co2, temperature } = factors;
    
    if (limitingFactor === 'temperature' && temperature > 40) {
      return {
        title: "Enzyme Denaturation",
        content: "At extreme temperatures, protein structures unfold permanently, breaking the active sites needed for photosynthesis.",
        icon: "🧬"
      };
    }
    
    if (limitingFactor === 'light' && light < 30) {
      return {
        title: "Light-Dependent Reactions",
        content: "Photosynthesis requires photons to split water molecules and generate ATP. Without sufficient light energy, the entire process halts.",
        icon: "⚡"
      };
    }
    
    if (limitingFactor === 'co2' && co2 < 300) {
      return {
        title: "Calvin Cycle Limitation", 
        content: "The Calvin cycle needs CO₂ molecules to build glucose. Low CO₂ means the plant cannot create the carbohydrates it needs to survive.",
        icon: "🔄"
      };
    }
    
    return {
      title: "Optimal Conditions",
      content: "All factors are well-balanced, allowing maximum photosynthetic efficiency and healthy plant growth.",
      icon: "✨"
    };
  };

  const getPhotosynthesisRate = () => {
    const { light, co2, temperature } = factors;
    
    let lightEff = Math.min(1, light / 80);
    let co2Eff = Math.min(1, co2 / 400);
    let tempEff = 1;
    
    if (temperature < 10 || temperature > 40) tempEff = 0;
    else if (temperature < 20 || temperature > 30) {
      tempEff = Math.max(0, 1 - Math.min(Math.abs(temperature - 20), Math.abs(temperature - 30)) / 10);
    }
    
    return Math.round(Math.min(lightEff, co2Eff, tempEff) * 100);
  };

  const insight = getBiologicalInsight();
  const photosynthesisRate = getPhotosynthesisRate();

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Plant Intelligence</h2>
        <p className="text-gray-400">Understanding the 'why' behind plant responses</p>
      </div>

      {/* Main Explanation Card */}
      <motion.div
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 shadow-xl border border-slate-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-start gap-3 mb-4">
          <motion.div
            className="text-2xl"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🧠
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-white">Current Analysis</h3>
            <p className="text-sm text-gray-400">Real-time biological assessment</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={explanation}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="text-gray-200 leading-relaxed"
          >
            {displayText}
            {isTyping && (
              <motion.span
                className="inline-block w-2 h-5 bg-green-400 ml-1"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Biological Insight Card */}
      <motion.div
        className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">{insight.icon}</span>
          <h4 className="text-lg font-semibold text-white">{insight.title}</h4>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed">
          {insight.content}
        </p>
      </motion.div>

      {/* Photosynthesis Rate Meter */}
      <motion.div
        className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span>📈</span>
          Photosynthesis Rate
        </h4>
        
        <div className="relative">
          <div className="h-8 bg-slate-700 rounded-lg overflow-hidden">
            <motion.div
              className={`h-full rounded-lg ${
                photosynthesisRate > 80 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                photosynthesisRate > 60 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                photosynthesisRate > 30 ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                'bg-gradient-to-r from-red-400 to-red-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${photosynthesisRate}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>0%</span>
            <span className="font-bold text-white">{photosynthesisRate}% efficiency</span>
            <span>100%</span>
          </div>
        </div>
        
        <div className="mt-3 text-sm text-gray-300">
          {photosynthesisRate > 80 ? 
            "Excellent! The plant is operating at peak efficiency." :
            photosynthesisRate > 60 ?
            "Good photosynthetic activity with room for improvement." :
            photosynthesisRate > 30 ?
            "Moderate efficiency. Environmental stress is limiting growth." :
            "Critical: Photosynthesis is severely impaired."
          }
        </div>
      </motion.div>

      {/* Environmental Impact Breakdown */}
      <motion.div
        className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span>🔍</span>
          Factor Analysis
        </h4>
        
        <div className="space-y-3">
          {['light', 'co2', 'temperature'].map((factor, index) => {
            const value = factors[factor];
            let efficiency, status;
            
            switch (factor) {
              case 'light':
                efficiency = Math.min(100, (value / 80) * 100);
                status = value < 30 ? 'Critical' : value < 60 ? 'Suboptimal' : 'Good';
                break;
              case 'co2':
                efficiency = Math.min(100, (value / 400) * 100);
                status = value < 250 ? 'Low' : value < 350 ? 'Adequate' : 'Optimal';
                break;
              case 'temperature':
                if (value < 10 || value > 40) efficiency = 0;
                else if (value < 20 || value > 30) {
                  efficiency = Math.max(0, 100 - Math.min(Math.abs(value - 20), Math.abs(value - 30)) * 10);
                } else efficiency = 100;
                status = efficiency === 0 ? 'Lethal' : efficiency < 50 ? 'Stress' : efficiency < 90 ? 'Suboptimal' : 'Perfect';
                break;
              default:
                efficiency = 100;
                status = 'Unknown';
            }
            
            return (
              <motion.div
                key={factor}
                className="flex items-center justify-between"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    limitingFactor === factor ? 'bg-red-400 animate-pulse' : 'bg-gray-500'
                  }`}></div>
                  <span className="text-gray-200 capitalize">{factor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${
                    efficiency > 80 ? 'text-green-400' :
                    efficiency > 50 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {status}
                  </span>
                  <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${
                        efficiency > 80 ? 'bg-green-400' :
                        efficiency > 50 ? 'bg-yellow-400' :
                        'bg-red-400'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${efficiency}%` }}
                      transition={{ duration: 0.8, delay: index * 0.2 }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default ExplanationPanel;