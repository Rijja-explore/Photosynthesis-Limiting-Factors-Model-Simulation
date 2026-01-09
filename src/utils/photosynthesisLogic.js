/**
 * Adapter layer for Member 1's core logic functions.
 *
 * IMPORTANT:
 * - Member 1 owns the scientific logic in `src/logic/*`.
 * - This file ONLY adapts those functions into the simpler API
 *   that Member 3's React components expect.
 *
 * No biology formulas are implemented here – we just call and reshape
 * the outputs from Member 1's pure JS logic modules.
 */

import { calculatePhotosynthesisRate as modelCalculatePhotosynthesisRate } from '../logic/photosynthesisModel';
import { identifyLimitingFactor } from '../logic/limitingFactor';
import { generateRecommendation } from '../logic/recommendationEngine';
import { simulateGrowth } from '../logic/timeLapseSimulation';

/**
 * Calculates photosynthesis rate based on environmental factors.
 *
 * Member 1's `calculatePhotosynthesisRate` returns:
 *   { rate: number, factors: { light, co2, temperature } }
 *
 * Member 3's UI expects just a numeric rate, so this adapter
 * forwards to the model and returns only `rate`.
 *
 * @param {number} light - Light intensity
 * @param {number} co2 - CO₂ concentration
 * @param {number} temperature - Temperature
 * @returns {number} Photosynthesis rate (0–1)
 */
export function calculatePhotosynthesisRate(light, co2, temperature) {
  const result = modelCalculatePhotosynthesisRate(light, co2, temperature);
  return result.rate;
}

/**
 * Detects the limiting factor for photosynthesis.
 *
 * Member 1 exposes `identifyLimitingFactor(normalizedFactors)` where
 * `normalizedFactors` is { light, co2, temperature } in 0–1 range.
 *
 * This adapter:
 * - Calls the model to get normalized factors
 * - Asks the limiting-factor module which factor is limiting
 * - Maps the internal keys ('light', 'co2', 'temperature') to
 *   the display strings used by Member 3's UI:
 *   'Light' | 'CO2' | 'Temperature'
 *
 * @param {number} light - Light intensity
 * @param {number} co2 - CO₂ concentration
 * @param {number} temperature - Temperature
 * @returns {string} Limiting factor name ('Light' | 'CO2' | 'Temperature')
 */
export function detectLimitingFactor(light, co2, temperature) {
  const modelResult = modelCalculatePhotosynthesisRate(light, co2, temperature);
  const limiting = identifyLimitingFactor(modelResult.factors);

  // Normalize to the strings the UI already expects
  switch (limiting.limitingFactor) {
    case 'light':
      return 'Light';
    case 'co2':
      return 'CO2';
    case 'temperature':
      return 'Temperature';
    default:
      return 'None';
  }
}

/**
 * Gets recommendation text based on the limiting factor.
 *
 * Member 1 exposes `generateRecommendation(limitingFactor, currentValues, normalizedFactors)`
 * and returns a rich object:
 *   { recommendation, warning, targetValue, limitingFactor }
 *
 * This adapter:
 * - Normalizes the limitingFactor string to Member 1's internal format
 * - Calls `generateRecommendation`
 * - Returns only the `recommendation` string for the UI
 *
 * @param {string} limitingFactor - UI limiting factor ('Light' | 'CO2' | 'Temperature' | 'None')
 * @param {number} light - Light intensity
 * @param {number} co2 - CO₂ concentration
 * @param {number} temperature - Temperature
 * @returns {string} Recommendation text
 */
export function getRecommendation(limitingFactor, light, co2, temperature) {
  // If there's no meaningful limiting factor, short-circuit
  if (!limitingFactor || limitingFactor === 'None') {
    return 'All factors are within acceptable ranges. Adjust the sliders or choose a scenario to explore different limitations.';
  }

  // Map display strings back to Member 1's internal keys
  let internalFactor;
  switch (limitingFactor) {
    case 'Light':
      internalFactor = 'light';
      break;
    case 'CO2':
    case 'CO₂':
      internalFactor = 'co2';
      break;
    case 'Temperature':
      internalFactor = 'temperature';
      break;
    default:
      internalFactor = 'light';
  }

  const currentValues = { light, co2, temperature };
  const modelResult = modelCalculatePhotosynthesisRate(light, co2, temperature);

  const { recommendation } = generateRecommendation(
    internalFactor,
    currentValues,
    modelResult.factors
  );

  return recommendation;
}

/**
 * Runs a time-lapse simulation over multiple days.
 *
 * Member 1 exposes `simulateGrowth(conditions, days, initialBiomass)`
 * which returns an array of objects including:
 *   { day, rate, biomass, dailyGain, ... }
 *
 * Member 3's graph only needs { time, rate }, so this adapter
 * forwards to `simulateGrowth` and reshapes the output.
 *
 * @param {Object} initialState - { light, co2, temperature }
 * @param {number} days - Number of days to simulate
 * @returns {Array} Array of { time, rate }
 */
export function runTimeLapseSimulation(initialState, days) {
  const { light, co2, temperature } = initialState;

  const results = simulateGrowth({ light, co2, temperature }, days);

  // Map Member 1's `day` to a zero-based `time` for the chart
  return results.map((entry, index) => ({
    time: entry.day != null ? entry.day : index + 1,
    rate: entry.rate
  }));
}

/**
 * Optional helper: expose normalized factor strengths for UI/debugging.
 * Uses Member 1's model to derive per-factor efficiencies.
 *
 * @param {number} light
 * @param {number} co2
 * @param {number} temperature
 * @returns {{ light: number, co2: number, temperature: number }}
 */
export function getFactorRates(light, co2, temperature) {
  const result = modelCalculatePhotosynthesisRate(light, co2, temperature);
  return { ...result.factors };
}
