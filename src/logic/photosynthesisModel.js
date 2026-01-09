/**
 * photosynthesisModel.js
 * Core photosynthesis rate calculation based on limiting factors
 * 
 * Scientific Basis: Law of Limiting Factors (Blackman, 1905)
 * The rate of photosynthesis is determined by the factor in shortest supply.
 */

// Optimal reference values for maximum photosynthesis
const OPTIMAL_VALUES = {
  light: 800,        // μmol/m²/s (micromoles per square meter per second)
  co2: 400,          // ppm (parts per million)
  temperature: 25    // °C (Celsius)
};

// Temperature range for enzyme activity
const TEMP_RANGE = {
  min: 0,           // Below this, enzymes are inactive
  optimal: 25,      // Peak enzyme efficiency
  max: 45           // Above this, enzymes denature
};

/**
 * Normalize light intensity to a 0-1 scale
 * Light follows a saturation curve - increases rapidly at low levels,
 * then plateaus as light-harvesting complexes become saturated.
 * 
 * @param {number} light - Light intensity (0-1000+ μmol/m²/s)
 * @returns {number} Normalized factor (0-1)
 */
function normalizeLightFactor(light) {
  if (light <= 0) return 0;
  
  // Michaelis-Menten-like saturation curve
  // This mimics how chloroplasts absorb light efficiently at low levels
  // but reach maximum capacity around optimal levels
  const normalized = light / (light + OPTIMAL_VALUES.light * 0.3);
  
  // Cap at 1.0 (100% efficiency)
  return Math.min(normalized, 1.0);
}

/**
 * Normalize CO₂ concentration to a 0-1 scale
 * CO₂ is a substrate for the Calvin cycle. More CO₂ = more carbon fixation,
 * up to the point where RuBisCO (the CO₂-fixing enzyme) is saturated.
 * 
 * @param {number} co2 - CO₂ concentration (0-2000+ ppm)
 * @returns {number} Normalized factor (0-1)
 */
function normalizeCO2Factor(co2) {
  if (co2 <= 0) return 0;
  
  // Linear rise with saturation
  // Below optimal: proportional increase
  // Above optimal: diminishing returns as RuBisCO saturates
  const normalized = Math.min(co2 / OPTIMAL_VALUES.co2, 1.0) * 
                     (1 - Math.exp(-co2 / OPTIMAL_VALUES.co2));
  
  return Math.min(normalized, 1.0);
}

/**
 * Normalize temperature to a 0-1 scale
 * Temperature affects enzyme kinetics. Too cold = slow reactions.
 * Too hot = enzyme denaturation. Optimal range = peak activity.
 * 
 * This follows a bell curve (normal distribution around optimal temp).
 * 
 * @param {number} temperature - Temperature in °C
 * @returns {number} Normalized factor (0-1)
 */
function normalizeTemperatureFactor(temperature) {
  // Below minimum or above maximum = near-zero activity
  if (temperature <= TEMP_RANGE.min) return 0.05;
  if (temperature >= TEMP_RANGE.max) return 0.05;
  
  // Bell curve centered at optimal temperature
  // Standard deviation controls the width of the optimal range
  const stdDev = 8; // Allows ~15-35°C to be reasonably productive
  const exponent = -Math.pow(temperature - TEMP_RANGE.optimal, 2) / (2 * stdDev * stdDev);
  
  return Math.exp(exponent);
}

/**
 * Calculate photosynthesis rate based on light, CO₂, and temperature
 * Returns both the overall rate and individual factor contributions.
 * 
 * The MINIMUM of the three factors determines the rate (Blackman's Law).
 * 
 * @param {number} light - Light intensity (μmol/m²/s)
 * @param {number} co2 - CO₂ concentration (ppm)
 * @param {number} temperature - Temperature (°C)
 * @returns {Object} { rate: number, factors: { light, co2, temperature } }
 */
export function calculatePhotosynthesisRate(light, co2, temperature) {
  // Normalize each environmental factor
  const lightFactor = normalizeLightFactor(light);
  const co2Factor = normalizeCO2Factor(co2);
  const tempFactor = normalizeTemperatureFactor(temperature);
  
  // Law of Limiting Factors: the slowest step limits the whole process
  // Like a chain - strength is determined by the weakest link
  const rate = Math.min(lightFactor, co2Factor, tempFactor);
  
  return {
    rate: rate,
    factors: {
      light: lightFactor,
      co2: co2Factor,
      temperature: tempFactor
    }
  };
}

/**
 * Get optimal reference values for display/comparison
 * @returns {Object} Optimal values for each factor
 */
export function getOptimalValues() {
  return { ...OPTIMAL_VALUES };
}

/**
 * Get temperature range information
 * @returns {Object} Temperature range constraints
 */
export function getTemperatureRange() {
  return { ...TEMP_RANGE };
}