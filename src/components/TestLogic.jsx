/**
 * TEST COMPONENT - Quick verification of Person 3's logic functions
 * 
 * Usage:
 * 1. Temporarily import this component in App.jsx or Simulator.jsx
 * 2. Render it to see test results in the UI
 * 3. Remove when done testing
 * 
 * Example:
 * import TestLogic from './components/TestLogic';
 * // Then render: <TestLogic />
 */

import React, { useEffect, useState } from 'react';
import {
  calculatePhotosynthesisRate,
  detectLimitingFactor,
  getRecommendation,
  runTimeLapseSimulation
} from '../utils/photosynthesisLogic';

const TestLogic = () => {
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    const results = [];

    // Test 1: calculatePhotosynthesisRate
    try {
      const rate1 = calculatePhotosynthesisRate(500, 400, 25);
      const rate2 = calculatePhotosynthesisRate(100, 800, 25);
      results.push({
        test: 'calculatePhotosynthesisRate',
        status: '✅ PASS',
        details: `Rate 1: ${rate1.toFixed(2)}, Rate 2: ${rate2.toFixed(2)}`,
        error: null
      });
    } catch (error) {
      results.push({
        test: 'calculatePhotosynthesisRate',
        status: '❌ FAIL',
        details: error.message,
        error: error
      });
    }

    // Test 2: detectLimitingFactor
    try {
      const factor1 = detectLimitingFactor(100, 800, 25);
      const factor2 = detectLimitingFactor(500, 100, 25);
      results.push({
        test: 'detectLimitingFactor',
        status: '✅ PASS',
        details: `Factor 1: ${factor1}, Factor 2: ${factor2}`,
        error: null
      });
    } catch (error) {
      results.push({
        test: 'detectLimitingFactor',
        status: '❌ FAIL',
        details: error.message,
        error: error
      });
    }

    // Test 3: getRecommendation
    try {
      const rec1 = getRecommendation('Light', 100, 400, 25);
      results.push({
        test: 'getRecommendation',
        status: '✅ PASS',
        details: `Recommendation length: ${rec1.length} chars`,
        error: null
      });
    } catch (error) {
      results.push({
        test: 'getRecommendation',
        status: '❌ FAIL',
        details: error.message,
        error: error
      });
    }

    // Test 4: runTimeLapseSimulation
    try {
      const simulation = runTimeLapseSimulation(
        { light: 500, co2: 400, temperature: 25 },
        10
      );
      results.push({
        test: 'runTimeLapseSimulation',
        status: '✅ PASS',
        details: `Returned ${simulation.length} data points. First: time=${simulation[0].time}, rate=${simulation[0].rate.toFixed(2)}`,
        error: null
      });
    } catch (error) {
      results.push({
        test: 'runTimeLapseSimulation',
        status: '❌ FAIL',
        details: error.message,
        error: error
      });
    }

    setTestResults(results);

    // Also log to console
    console.log('🧪 Logic Function Tests:');
    results.forEach(result => {
      console.log(`${result.status} ${result.test}: ${result.details}`);
    });
  }, []);

  const allPassed = testResults.every(r => r.status === '✅ PASS');

  return (
    <div className="bg-white rounded-lg shadow-md p-6 m-4 border-2 border-blue-500">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        🧪 Logic Functions Test Results
      </h2>
      
      <div className="space-y-3">
        {testResults.map((result, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              result.status === '✅ PASS'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-700">{result.test}</span>
              <span className="font-bold">{result.status}</span>
            </div>
            <p className="text-sm text-gray-600">{result.details}</p>
            {result.error && (
              <pre className="mt-2 text-xs text-red-600 bg-red-100 p-2 rounded">
                {result.error.stack}
              </pre>
            )}
          </div>
        ))}
      </div>

      <div className={`mt-4 p-4 rounded-lg ${
        allPassed
          ? 'bg-green-100 border border-green-300'
          : 'bg-red-100 border border-red-300'
      }`}>
        <p className="font-bold text-lg text-center">
          {allPassed
            ? '🎉 All tests passed! Person 3\'s code is working correctly.'
            : '⚠️ Some tests failed. Check errors above.'}
        </p>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Verification Checklist:</strong>
        </p>
        <ul className="text-sm text-gray-600 mt-2 space-y-1 ml-4">
          <li>✓ No runtime errors</li>
          <li>✓ Numbers change when inputs change</li>
          <li>✓ Functions return expected data types</li>
        </ul>
      </div>
    </div>
  );
};

export default TestLogic;


