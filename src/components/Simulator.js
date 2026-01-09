import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PlantVisualization from './PlantVisualization';
import EnvironmentalControls from './EnvironmentalControls';
import ExplanationPanel from './ExplanationPanel';
import RecommendationEngine from './RecommendationEngine';
import ScenarioSelector from './ScenarioSelector';
import TimeLapse from './TimeLapse';

const Simulator = ({ onBack }) => {
  const [environmentalFactors, setEnvironmentalFactors] = useState({
    light: 70,     // 0-100 scale
    co2: 400,      // ppm
    temperature: 25 // celsius
  });

  const [plantHealth, setPlantHealth] = useState(85);
  const [limitingFactor, setLimitingFactor] = useState('');
  const [explanation, setExplanation] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [currentScenario, setCurrentScenario] = useState('optimal');
  const [timelapseActive, setTimelapseActive] = useState(false);
  const [plantHistory, setPlantHistory] = useState([]);

  // Photosynthesis calculation and limiting factor detection
  useEffect(() => {
    const newHealth = calculatePlantHealth(environmentalFactors);
    const limiting = detectLimitingFactor(environmentalFactors);
    const newExplanation = generateExplanation(environmentalFactors, limiting);
    const newRecommendations = generateRecommendations(environmentalFactors, limiting);

    setPlantHealth(newHealth);
    setLimitingFactor(limiting);
    setExplanation(newExplanation);
    setRecommendations(newRecommendations);

    // Update plant history for time-lapse
    setPlantHistory(prev => {
      const newHistory = [...prev, { 
        health: newHealth, 
        factors: { ...environmentalFactors }, 
        timestamp: Date.now() 
      }];
      return newHistory.slice(-30); // Keep last 30 data points
    });
  }, [environmentalFactors]);

  const calculatePlantHealth = (factors) => {
    const { light, co2, temperature } = factors;
    
    // Optimal ranges
    const optimalLight = 80;
    const optimalCO2 = 400;
    
    // Calculate efficiency for each factor
    let lightEfficiency = Math.max(0, Math.min(1, light / optimalLight));
    let co2Efficiency = Math.max(0, Math.min(1, co2 / optimalCO2));
    let tempEfficiency = 1;
    
    // Temperature has a bell curve - efficiency drops on both sides
    if (temperature < 10 || temperature > 40) {
      tempEfficiency = 0;
    } else if (temperature < 20 || temperature > 30) {
      const deviation = Math.min(Math.abs(temperature - 20), Math.abs(temperature - 30));
      tempEfficiency = Math.max(0, 1 - (deviation / 10));
    }
    
    // Light becomes limiting below 30
    if (light < 30) lightEfficiency = light / 100;
    
    // CO2 efficiency plateaus above 800ppm
    if (co2 > 800) co2Efficiency = 1;
    
    // Health is limited by the most restrictive factor (Liebig's Law)
    const limitingEfficiency = Math.min(lightEfficiency, co2Efficiency, tempEfficiency);
    return Math.round(limitingEfficiency * 100);
  };

  const detectLimitingFactor = (factors) => {
    const { light, co2, temperature } = factors;
    
    // Calculate how far each factor is from optimal
    const lightScore = light < 30 ? light / 100 : Math.min(1, light / 80);
    const co2Score = Math.min(1, co2 / 400);
    const tempScore = temperature < 10 || temperature > 40 ? 0 : 
                     temperature < 20 || temperature > 30 ? 
                     Math.max(0, 1 - Math.min(Math.abs(temperature - 20), Math.abs(temperature - 30)) / 10) : 1;
    
    if (tempScore <= lightScore && tempScore <= co2Score) return 'temperature';
    if (lightScore <= co2Score) return 'light';
    return 'co2';
  };

  const generateExplanation = (factors, limiting) => {
    const { light, co2, temperature } = factors;
    
    switch (limiting) {
      case 'temperature':
        if (temperature > 40) {
          return `At ${temperature}°C, enzyme structures are breaking down, making photosynthesis impossible regardless of perfect light and CO₂ levels. Cellular respiration is consuming more energy than photosynthesis can produce.`;
        } else if (temperature < 10) {
          return `At ${temperature}°C, molecular movement is too slow for efficient photosynthesis. Enzymes are nearly inactive, severely limiting the plant's ability to process light energy.`;
        }
        return `Temperature stress is affecting enzyme efficiency. The plant's biochemical processes are operating below optimal capacity.`;
      
      case 'light':
        if (light < 20) {
          return `With only ${light}% light intensity, the plant cannot capture enough photons to drive photosynthesis effectively. The light-dependent reactions are severely limited.`;
        }
        return `Light is currently limiting photosynthesis. Even with adequate CO₂ and temperature, insufficient light energy is preventing optimal glucose production.`;
      
      case 'co2':
        if (co2 < 200) {
          return `At ${co2} ppm CO₂, the Calvin cycle cannot function properly. The plant lacks sufficient carbon dioxide molecules to build glucose, even with perfect light and temperature.`;
        }
        return `CO₂ concentration is the limiting factor. The plant has adequate energy from light but insufficient raw materials for carbon fixation.`;
      
      default:
        return `All factors are well-balanced. The plant is operating near optimal photosynthetic capacity.`;
    }
  };

  const generateRecommendations = (factors, limiting) => {
    const recommendations = [];
    const { light, co2, temperature } = factors;
    
    switch (limiting) {
      case 'temperature':
        if (temperature > 40) {
          recommendations.push({
            action: `Reduce temperature by ${Math.round(temperature - 30)}°C`,
            impact: `Will restore enzyme function and increase photosynthesis rate by ${Math.round((temperature - 30) * 2)}%`,
            priority: 'critical'
          });
        } else if (temperature < 10) {
          recommendations.push({
            action: `Increase temperature by ${Math.round(20 - temperature)}°C`,
            impact: `Will restore enzyme activity and improve photosynthesis efficiency by ${Math.round((20 - temperature) * 3)}%`,
            priority: 'critical'
          });
        }
        break;
      
      case 'light':
        const lightIncrease = Math.min(100 - light, 30);
        recommendations.push({
          action: `Increase light intensity by ${lightIncrease}%`,
          impact: `Will boost photon capture and improve glucose production by ${Math.round(lightIncrease * 1.5)}%`,
          priority: light < 20 ? 'critical' : 'high'
        });
        break;
      
      case 'co2':
        const co2Increase = Math.min(800 - co2, 200);
        recommendations.push({
          action: `Increase CO₂ concentration by ${co2Increase} ppm`,
          impact: `Will enhance carbon fixation and increase photosynthesis rate by ${Math.round(co2Increase * 0.3)}%`,
          priority: co2 < 300 ? 'high' : 'medium'
        });
        break;
      
      default:
        // No specific recommendations when all factors are optimal
        break;
    }
    
    return recommendations;
  };

  const handleFactorChange = (factor, value) => {
    setEnvironmentalFactors(prev => ({
      ...prev,
      [factor]: value
    }));
  };

  const handleScenarioChange = (scenario) => {
    setCurrentScenario(scenario);
    
    switch (scenario) {
      case 'climate2050':
        setEnvironmentalFactors({ light: 75, co2: 500, temperature: 32 });
        break;
      case 'drought':
        setEnvironmentalFactors({ light: 85, co2: 380, temperature: 38 });
        break;
      case 'greenhouse':
        setEnvironmentalFactors({ light: 90, co2: 600, temperature: 26 });
        break;
      default:
        setEnvironmentalFactors({ light: 70, co2: 400, temperature: 25 });
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
            <PlantVisualization 
              health={plantHealth}
              factors={environmentalFactors}
              limitingFactor={limitingFactor}
            />
            <TimeLapse 
              active={timelapseActive}
              onToggle={setTimelapseActive}
              plantHistory={plantHistory}
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