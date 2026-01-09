import React from 'react';

/**
 * Recommendation Component
 * Displays limiting factor and recommendation text
 * Pure presentation component - no logic
 */

// Color mapping for different limiting factors
const getLimitingFactorColor = (factor) => {
  switch (factor) {
    case 'Light':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'CO₂':
    case 'CO2': // Handle both formats
      return 'bg-green-100 text-green-800 border-green-300';
    case 'Temperature':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-blue-100 text-blue-800 border-blue-300';
  }
};

const Recommendation = ({ limitingFactor, recommendationText }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Analysis & Recommendations</h2>
      
      {/* Limiting Factor Badge */}
      <div className="mb-4">
        <label className="text-sm font-semibold text-gray-600 block mb-2">
          Current Limiting Factor:
        </label>
        <div
          className={`inline-block px-4 py-2 rounded-lg border-2 font-bold text-lg ${getLimitingFactorColor(
            limitingFactor
          )}`}
        >
          {limitingFactor || 'None'}
        </div>
      </div>

      {/* Recommendation Text */}
      <div className="mt-4">
        <label className="text-sm font-semibold text-gray-600 block mb-2">
          Recommendation:
        </label>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-gray-700 leading-relaxed">
            {recommendationText || 'Adjust the environmental controls to see recommendations.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Recommendation;

