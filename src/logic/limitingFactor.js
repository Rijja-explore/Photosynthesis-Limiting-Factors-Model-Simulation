/**
 * limitingFactor.js
 * Identifies which environmental factor is limiting photosynthesis
 * and provides scientific explanation
 * 
 * Based on: Blackman's Law of Limiting Factors
 */

/**
 * Educational explanations for why each factor might be limiting
 */
const EXPLANATIONS = {
  light: {
    low: "Light intensity is limiting because chloroplasts need photons to excite electrons in the light-dependent reactions. Without sufficient light energy, the entire photosynthetic process slows down, regardless of other factors.",
    adequate: "Light intensity is adequate. Photosystems I and II are receiving enough photons to drive electron transport and ATP/NADPH production efficiently."
  },
  co2: {
    low: "CO₂ concentration is limiting because the Calvin cycle requires carbon dioxide as the substrate for carbon fixation. RuBisCO (the CO₂-fixing enzyme) cannot work faster than CO₂ is available, creating a bottleneck.",
    adequate: "CO₂ concentration is adequate. The Calvin cycle has sufficient substrate for RuBisCO to fix carbon at its maximum rate."
  },
  temperature: {
    low: "Temperature is limiting because enzymes (like RuBisCO and ATP synthase) have reduced kinetic energy at low temperatures. Molecular collisions happen less frequently, slowing all biochemical reactions.",
    high: "Temperature is limiting because excessive heat denatures photosynthetic enzymes, disrupting their 3D structure. This permanently damages the catalytic sites needed for the Calvin cycle and light reactions.",
    optimal: "Temperature is optimal. Enzymes are working at peak efficiency with maximum molecular collision rates and intact protein structures."
  }
};

/**
 * Determine which factor is the primary limiting factor
 * 
 * @param {Object} normalizedFactors - { light, co2, temperature } normalized 0-1
 * @returns {Object} { limitingFactor: string, reason: string, severity: string }
 */
export function identifyLimitingFactor(normalizedFactors) {
  const { light, co2, temperature } = normalizedFactors;
  
  // Find the minimum (most limiting) factor
  const minValue = Math.min(light, co2, temperature);
  
  // Determine which factor(s) match the minimum
  let limitingFactor;
  let reason;
  
  // Identify the limiting factor
  if (light === minValue) {
    limitingFactor = "light";
    reason = EXPLANATIONS.light.low;
  } else if (co2 === minValue) {
    limitingFactor = "co2";
    reason = EXPLANATIONS.co2.low;
  } else {
    limitingFactor = "temperature";
    // Determine if temperature is too low or too high
    // (This requires additional context - we'll use a heuristic)
    if (temperature < 0.7) {
      reason = EXPLANATIONS.temperature.low;
    } else if (temperature > 0.95) {
      reason = EXPLANATIONS.temperature.optimal;
    } else {
      reason = EXPLANATIONS.temperature.high;
    }
  }
  
  // Calculate severity based on how limiting the factor is
  let severity;
  if (minValue < 0.3) {
    severity = "severe"; // Critical limitation
  } else if (minValue < 0.6) {
    severity = "moderate"; // Noticeable limitation
  } else {
    severity = "mild"; // Minor limitation
  }
  
  return {
    limitingFactor,
    reason,
    severity,
    value: minValue
  };
}

/**
 * Analyze all factors and provide a comprehensive breakdown
 * Useful for detailed reporting and educational displays
 * 
 * @param {Object} normalizedFactors - { light, co2, temperature }
 * @param {Object} rawValues - { light, co2, temperature } original values
 * @returns {Object} Detailed analysis of each factor
 */
export function analyzeAllFactors(normalizedFactors, rawValues) {
  const { light, co2, temperature } = normalizedFactors;
  
  // Determine status for each factor
  const analysis = {
    light: {
      value: light,
      status: light > 0.7 ? "optimal" : light > 0.4 ? "suboptimal" : "limiting",
      rawValue: rawValues.light,
      explanation: light > 0.7 ? EXPLANATIONS.light.adequate : EXPLANATIONS.light.low
    },
    co2: {
      value: co2,
      status: co2 > 0.7 ? "optimal" : co2 > 0.4 ? "suboptimal" : "limiting",
      rawValue: rawValues.co2,
      explanation: co2 > 0.7 ? EXPLANATIONS.co2.adequate : EXPLANATIONS.co2.low
    },
    temperature: {
      value: temperature,
      status: temperature > 0.85 ? "optimal" : temperature > 0.5 ? "suboptimal" : "limiting",
      rawValue: rawValues.temperature,
      explanation: temperature > 0.85 ? EXPLANATIONS.temperature.optimal : 
                   rawValues.temperature < 20 ? EXPLANATIONS.temperature.low : 
                   EXPLANATIONS.temperature.high
    }
  };
  
  // Identify primary limiting factor
  const limiting = identifyLimitingFactor(normalizedFactors);
  
  return {
    factors: analysis,
    limiting: limiting.limitingFactor,
    overallEfficiency: Math.min(light, co2, temperature),
    summary: `Photosynthesis is operating at ${Math.round(limiting.value * 100)}% efficiency. ${limiting.reason}`
  };
}

/**
 * Check if conditions are near-optimal (all factors > 0.8)
 * @param {Object} normalizedFactors - { light, co2, temperature }
 * @returns {boolean} True if conditions are excellent
 */
export function isNearOptimal(normalizedFactors) {
  const { light, co2, temperature } = normalizedFactors;
  return light > 0.8 && co2 > 0.8 && temperature > 0.8;
}