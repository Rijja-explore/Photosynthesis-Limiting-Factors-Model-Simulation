import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PlantVisualization3D from './PlantVisualization3D';
import EnvironmentalControls from './EnvironmentalControls';
import ExplanationPanel from './ExplanationPanel';
import RecommendationEngine from './RecommendationEngine';
import ScenarioSelector from './ScenarioSelector';
import TimeLapse from './TimeLapse';
// BACKEND LOGIC IMPORTS - PROPER SEPARATION
import { calculatePhotosynthesisRate, detectLimitingFactor, getRecommendation } from '../utils/photosynthesisLogic';
import { SCENARIO_PRESETS } from '../logic/recommendationEngine';
const Simulator = ({ onBack }) => {
  // SIMPLE INITIAL STATE
  const [environmentalFactors, setEnvironmentalFactors] = useState({
    light: 700,     // μmol/m²/s 
    co2: 400,       // ppm
    temperature: 25 // celsius
  });

  const [plantHealth, setPlantHealth] = useState(85);
  const [limitingFactor, setLimitingFactor] = useState('');
  const [explanation, setExplanation] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [currentScenario, setCurrentScenario] = useState('optimal');
  const [timelapseActive, setTimelapseActive] = useState(false);
  const [plantHistory, setPlantHistory] = useState([]);

  // FRONTEND → BACKEND CONNECTION 
  useEffect(() => {
    const { light, co2, temperature } = environmentalFactors;
    
    // Call backend logic functions
    const photosynthesisRate = calculatePhotosynthesisRate(light, co2, temperature);
    const limiting = detectLimitingFactor(light, co2, temperature);
    const recommendation = getRecommendation(limiting, light, co2, temperature);
    
    // Update frontend state with backend results
    const newHealth = Math.max(10, Math.min(100, photosynthesisRate * 100));
    setPlantHealth(newHealth);
    setLimitingFactor(limiting);
    setExplanation(recommendation);
    setRecommendations([{
      action: recommendation,
      priority: photosynthesisRate < 0.3 ? 'critical' : photosynthesisRate < 0.6 ? 'high' : 'medium'
    }]);

    // Update plant history
    setPlantHistory(prev => {
      const newHistory = [...prev, { 
        health: newHealth,
        photosynthesisRate: photosynthesisRate,
        factors: { ...environmentalFactors }, 
        limiting,
        timestamp: Date.now() 
      }];
      return newHistory.slice(-30);
    });
  }, [environmentalFactors]);

  // HANDLE SLIDER CHANGES
  const handleFactorChange = (factor, value) => {
    setEnvironmentalFactors(prev => ({
      ...prev,
      [factor]: value
    }));
  };

  const handleScenarioChange = (scenario) => {
    setCurrentScenario(scenario);
    
    // Use proper backend scenario presets
    const scenarioData = SCENARIO_PRESETS[scenario];
    if (scenarioData) {
      setEnvironmentalFactors({
        light: scenarioData.light,
        co2: scenarioData.co2,
        temperature: scenarioData.temperature
      });
    } else {
      // Default optimal conditions
      setEnvironmentalFactors({ light: 85, co2: 400, temperature: 25 });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <motion.header 
        className="bg-slate-800 shadow-xl border-b border-slate-700 px-6 py-4"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button 
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors duration-200"
              onClick={onBack}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>←</span>
              <span>Back to Landing</span>
            </motion.button>
            <div>
              <h1 className="text-2xl font-bold text-white">Intelligent Photosynthesis Simulator</h1>
              <p className="text-sm text-gray-400">Advanced plant biology decision support system</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-sm text-gray-400">Plant Health</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-3 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full transition-all duration-500 ${
                      plantHealth > 80 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                      plantHealth > 60 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                      plantHealth > 30 ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                      'bg-gradient-to-r from-red-400 to-red-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${plantHealth}%` }}
                  />
                </div>
                <span className="text-lg font-bold text-white min-w-[3rem]">
                  {plantHealth}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Left Panel - Controls */}
          <motion.div 
            className="space-y-6"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <EnvironmentalControls 
              factors={environmentalFactors}
              onChange={handleFactorChange}
              limitingFactor={limitingFactor}
            />
            <ScenarioSelector 
              currentScenario={currentScenario}
              onScenarioChange={handleScenarioChange}
            />
          </motion.div>

          {/* Center Panel - Plant Visualization */}
          <motion.div 
            className="space-y-6"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <PlantVisualization3D 
              environmentalFactors={environmentalFactors}
              plantHealth={plantHealth}
              photosynthesisRate={calculatePhotosynthesisRate(environmentalFactors.light, environmentalFactors.co2, environmentalFactors.temperature)}
              limitingFactor={limitingFactor}
            />
            <TimeLapse 
              active={timelapseActive}
              onToggle={setTimelapseActive}
              plantHistory={plantHistory}
              environmentalFactors={environmentalFactors}
              currentPhotosynthesisRate={calculatePhotosynthesisRate(environmentalFactors.light, environmentalFactors.co2, environmentalFactors.temperature)}
            />
          </motion.div>

          {/* Right Panel - Intelligence */}
          <motion.div 
            className="space-y-6"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <ExplanationPanel 
              explanation={explanation}
              limitingFactor={limitingFactor}
              factors={environmentalFactors}
            />
            <RecommendationEngine 
              recommendations={recommendations}
              currentHealth={plantHealth}
            />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Simulator;
