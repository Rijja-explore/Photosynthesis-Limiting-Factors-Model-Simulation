import React from 'react';

/**
 * Controls Component
 * Provides sliders for Light, CO₂, and Temperature inputs
 * Pure presentation component - no business logic
 */
const Controls = ({ light, setLight, co2, setCo2, temperature, setTemperature }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Environmental Controls</h2>
      
      {/* Light Intensity Slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label htmlFor="light" className="text-lg font-semibold text-gray-700">
            Light Intensity
          </label>
          <span className="text-xl font-bold text-blue-600">{light} μmol/m²/s</span>
        </div>
        <input
          id="light"
          type="range"
          min="0"
          max="2000"
          step="10"
          value={light}
          onChange={(e) => setLight(Number(e.target.value))}
          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>0</span>
          <span>2000</span>
        </div>
      </div>

      {/* CO₂ Concentration Slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label htmlFor="co2" className="text-lg font-semibold text-gray-700">
            CO₂ Concentration
          </label>
          <span className="text-xl font-bold text-green-600">{co2} ppm</span>
        </div>
        <input
          id="co2"
          type="range"
          min="0"
          max="1000"
          step="10"
          value={co2}
          onChange={(e) => setCo2(Number(e.target.value))}
          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>0</span>
          <span>1000</span>
        </div>
      </div>

      {/* Temperature Slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label htmlFor="temperature" className="text-lg font-semibold text-gray-700">
            Temperature
          </label>
          <span className="text-xl font-bold text-red-600">{temperature} °C</span>
        </div>
        <input
          id="temperature"
          type="range"
          min="0"
          max="50"
          step="1"
          value={temperature}
          onChange={(e) => setTemperature(Number(e.target.value))}
          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>0</span>
          <span>50</span>
        </div>
      </div>
    </div>
  );
};

export default Controls;


