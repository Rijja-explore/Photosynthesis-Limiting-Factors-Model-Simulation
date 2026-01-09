import React, { useState, useEffect } from 'react';
import Controls from '../components/Controls';
import ScenarioPresets from '../components/ScenarioPresets';
import Graph from '../components/Graph';
import Recommendation from '../components/Recommendation';
import PlantVisual from '../components/PlantVisual';
import StressIndicator from '../components/StressIndicator';
import ModeToggle from '../components/ModeToggle';
import {
  calculatePhotosynthesisRate,
  detectLimitingFactor,
  getRecommendation,
  runTimeLapseSimulation
} from '../utils/photosynthesisLogic';

/**
 * Simulator Page - Main Integration Component
 * 
 * Responsibilities:
 * - Maintains global state for all simulation parameters
 * - Calls logic functions when inputs change
 * - Passes correct props to all child components
 * - Handles Learning Mode vs Experiment Mode toggle
 * - Handles time-lapse simulation
 */
const Simulator = () => {
  // Global state management
  const [light, setLight] = useState(800);
  const [co2, setCo2] = useState(400);
  const [temperature, setTemperature] = useState(25);
  
  // Computed state
  const [photosynthesisRate, setPhotosynthesisRate] = useState(0);
  const [limitingFactor, setLimitingFactor] = useState('None');
  const [recommendationText, setRecommendationText] = useState('');
  const [plantHealth, setPlantHealth] = useState(85);
  
  // Graph data state
  const [graphData, setGraphData] = useState([]);
  
  // Mode toggle
  const [isLearningMode, setIsLearningMode] = useState(true);

  // Recompute values when inputs change
  useEffect(() => {
    // Calculate photosynthesis rate
    const rate = calculatePhotosynthesisRate(light, co2, temperature);
    setPhotosynthesisRate(rate);

    // Detect limiting factor
    const factor = detectLimitingFactor(light, co2, temperature);
    setLimitingFactor(factor);

    // Get recommendation
    const recommendation = getRecommendation(factor, light, co2, temperature);
    setRecommendationText(recommendation);

    // Calculate plant health based on photosynthesis rate and environmental factors
    // Health = base health + (rate * 20) with adjustments for suboptimal conditions
    let healthAdjustment = rate * 30; // Max +30 health from rate
    
    // Penalties for suboptimal conditions
    if (temperature < 15 || temperature > 35) healthAdjustment -= 15;
    else if (temperature < 18 || temperature > 30) healthAdjustment -= 8;
    
    if (light < 200) healthAdjustment -= 10;
    if (co2 < 250) healthAdjustment -= 8;
    
    const newHealth = Math.max(0, Math.min(100, 70 + healthAdjustment));
    setPlantHealth(newHealth);

    // Update graph data with current point
    const currentTime = graphData.length > 0 
      ? graphData[graphData.length - 1].time + 1 
      : 0;
    
    setGraphData(prevData => [
      ...prevData,
      { time: currentTime, rate: rate }
    ]);
  }, [light, co2, temperature, graphData.length]);

  // Handle time-lapse simulation
  const handleTimeLapseSimulation = () => {
    const initialState = { light, co2, temperature };
    const simulationData = runTimeLapseSimulation(initialState, 30);
    
    // Merge with existing data, starting from current time
    const startTime = graphData.length > 0 ? graphData[graphData.length - 1].time + 1 : 0;
    const newData = simulationData.map((point, index) => ({
      time: startTime + point.time,
      rate: point.rate
    }));
    
    setGraphData(prevData => [...prevData, ...newData]);
  };

  // Reset graph data
  const handleResetGraph = () => {
    setGraphData([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Intelligent Photosynthesis Limiting Factors Simulator
          </h1>
          <p className="text-gray-600">
            Explore how light, CO₂, and temperature affect photosynthesis rates
          </p>
        </div>

        {/* Mode Toggle - New Component */}
        <ModeToggle isLearningMode={isLearningMode} onToggle={() => setIsLearningMode(!isLearningMode)} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Controls */}
          <div className="lg:col-span-1 space-y-6">
            <Controls
              light={light}
              setLight={setLight}
              co2={co2}
              setCo2={setCo2}
              temperature={temperature}
              setTemperature={setTemperature}
            />
            <ScenarioPresets
              setLight={setLight}
              setCo2={setCo2}
              setTemperature={setTemperature}
            />
            <StressIndicator 
              plantHealth={plantHealth}
              limitingFactor={limitingFactor}
            />
          </div>

          {/* Middle Column - Plant Visualization */}
          <div className="lg:col-span-2 space-y-6">
            <PlantVisual
              photosynthesisRate={photosynthesisRate}
              stressLevel={100 - plantHealth}
              limitingFactor={limitingFactor}
              plantHealth={plantHealth}
            />
          </div>

          {/* Right Column - Results & Analysis */}
          <div className="lg:col-span-1 space-y-6">
            {/* Current Rate Display */}
            <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-lg shadow-md p-6 text-white">
              <h2 className="text-xl font-semibold mb-2">Photosynthesis Rate</h2>
              <p className="text-4xl font-bold">{photosynthesisRate.toFixed(2)}</p>
              <p className="text-sm opacity-90 mt-1">efficiency</p>
            </div>

            {/* Recommendation */}
            <Recommendation
              limitingFactor={limitingFactor}
              recommendationText={recommendationText}
            />

            {/* Graph Controls */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleTimeLapseSimulation}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  📊 Simulate 30 Days
                </button>
                <button
                  onClick={handleResetGraph}
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  🔄 Reset Graph
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Graph - Full Width Below */}
        <div>
          <Graph data={graphData} />
        </div>
      </div>
    </div>
  );
};

export default Simulator;


