import React from 'react';

/**
 * ScenarioPresets Component
 * Provides one-click buttons to set real-world scenario parameters
 * Pure presentation component - only sets values via props
 */

// Predefined scenario configurations
const SCENARIOS = {
  climateChange2050: {
    name: 'Climate Change 2050',
    description: 'High CO₂, elevated temperature',
    light: 800,
    co2: 450,
    temperature: 28,
    color: 'bg-orange-500 hover:bg-orange-600'
  },
  greenhouseFarming: {
    name: 'Greenhouse Farming',
    description: 'Optimized conditions',
    light: 1200,
    co2: 600,
    temperature: 22,
    color: 'bg-green-500 hover:bg-green-600'
  },
  droughtConditions: {
    name: 'Drought Conditions',
    description: 'High light, low CO₂',
    light: 1500,
    co2: 250,
    temperature: 32,
    color: 'bg-yellow-500 hover:bg-yellow-600'
  },
  tropicalRainforest: {
    name: 'Tropical Rainforest',
    description: 'Moderate light, high humidity',
    light: 600,
    co2: 380,
    temperature: 26,
    color: 'bg-emerald-500 hover:bg-emerald-600'
  }
};

const ScenarioPresets = ({ setLight, setCo2, setTemperature }) => {
  const handleScenarioClick = (scenario) => {
    setLight(scenario.light);
    setCo2(scenario.co2);
    setTemperature(scenario.temperature);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Scenario Presets</h2>
      <p className="text-gray-600 mb-4">Click a scenario to apply preset conditions</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.values(SCENARIOS).map((scenario) => (
          <button
            key={scenario.name}
            onClick={() => handleScenarioClick(scenario)}
            className={`${scenario.color} text-white rounded-lg p-4 text-left transition-all duration-200 transform hover:scale-105 shadow-md`}
          >
            <h3 className="font-bold text-lg mb-1">{scenario.name}</h3>
            <p className="text-sm opacity-90 mb-2">{scenario.description}</p>
            <div className="text-xs opacity-75 space-y-1">
              <div>Light: {scenario.light} μmol/m²/s</div>
              <div>CO₂: {scenario.co2} ppm</div>
              <div>Temp: {scenario.temperature} °C</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ScenarioPresets;


