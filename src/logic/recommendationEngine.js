/**
 * recommendationEngine.js
 * Generates intelligent, actionable recommendations to improve photosynthesis
 * 
 * Analyzes the limiting factor and suggests specific interventions
 */

/**
 * Generate a recommendation based on the limiting factor
 * 
 * @param {string} limitingFactor - "light", "co2", or "temperature"
 * @param {Object} currentValues - { light, co2, temperature } current raw values
 * @param {Object} normalizedFactors - { light, co2, temperature } normalized 0-1
 * @returns {Object} { recommendation: string, warning?: string, targetValue?: number }
 */
export function generateRecommendation(limitingFactor, currentValues, normalizedFactors) {
  const { light, co2, temperature } = currentValues;
  
  let recommendation = "";
  let warning = null;
  let targetValue = null;
  
  switch (limitingFactor) {
    case "light":
      if (light < 200) {
        recommendation = "Increase light intensity significantly. Consider moving the plant closer to a light source or adding supplemental grow lights. Target: 400-800 μmol/m²/s for optimal photosynthesis.";
        targetValue = 600;
      } else if (light < 500) {
        recommendation = "Increase light intensity moderately. Add more lighting or increase exposure duration. Target: 600-800 μmol/m²/s.";
        targetValue = 700;
      } else if (light < 800) {
        recommendation = "Light is approaching optimal levels. A small increase to 800+ μmol/m²/s would maximize light-dependent reactions.";
        targetValue = 850;
      } else {
        recommendation = "Light intensity is already optimal. Further increases will not improve photosynthesis rate.";
        warning = "Light is not the limiting factor. Focus on other environmental conditions.";
      }
      break;
      
    case "co2":
      if (co2 < 200) {
        recommendation = "Increase CO₂ concentration significantly. Ensure adequate ventilation or consider CO₂ supplementation. Target: 400-600 ppm for optimal carbon fixation.";
        targetValue = 500;
      } else if (co2 < 400) {
        recommendation = "Increase CO₂ to atmospheric levels (400 ppm) or higher. Improve air circulation or add CO₂ enrichment.";
        targetValue = 450;
      } else if (co2 < 600) {
        recommendation = "CO₂ is near-optimal. Consider enrichment to 600-800 ppm for enhanced growth (common in greenhouses).";
        targetValue = 700;
      } else {
        recommendation = "CO₂ concentration is already optimal. Further increases will have minimal effect.";
        warning = "CO₂ is not the limiting factor. Check temperature and light conditions.";
      }
      break;
      
    case "temperature":
      if (temperature < 15) {
        recommendation = "Increase temperature significantly. Enzymes are too cold to function efficiently. Target: 20-25°C for optimal enzyme activity.";
        targetValue = 23;
        warning = "At temperatures below 15°C, photosynthetic enzymes work very slowly. Heating is critical.";
      } else if (temperature < 20) {
        recommendation = "Increase temperature moderately. Target: 23-27°C for peak photosynthetic efficiency.";
        targetValue = 25;
      } else if (temperature > 35) {
        recommendation = "Decrease temperature urgently. Enzymes are at risk of denaturation. Target: 22-28°C to prevent permanent damage.";
        targetValue = 25;
        warning = "High temperatures can permanently damage photosynthetic machinery. Cooling is critical.";
      } else if (temperature > 30) {
        recommendation = "Decrease temperature slightly. Efficiency drops as enzymes approach denaturation. Target: 23-27°C.";
        targetValue = 25;
      } else {
        recommendation = "Temperature is in the optimal range (20-30°C). Maintain current conditions.";
        warning = "Temperature is not the limiting factor. Focus on light or CO₂.";
      }
      break;
      
    default:
      recommendation = "Unable to determine limiting factor. Check all environmental parameters.";
  }
  
  return {
    recommendation,
    warning,
    targetValue,
    limitingFactor
  };
}

/**
 * Generate a priority list of actions based on all factors
 * Returns ordered list from most to least impactful
 * 
 * @param {Object} normalizedFactors - { light, co2, temperature }
 * @param {Object} currentValues - { light, co2, temperature }
 * @returns {Array} Ordered array of action items
 */
export function generatePriorityActions(normalizedFactors, currentValues) {
  const factors = [
    { name: "light", value: normalizedFactors.light, current: currentValues.light },
    { name: "co2", value: normalizedFactors.co2, current: currentValues.co2 },
    { name: "temperature", value: normalizedFactors.temperature, current: currentValues.temperature }
  ];
  
  // Sort by normalized value (lowest = most limiting = highest priority)
  factors.sort((a, b) => a.value - b.value);
  
  const actions = factors.map((factor, index) => {
    const priority = index === 0 ? "high" : index === 1 ? "medium" : "low";
    const rec = generateRecommendation(factor.name, currentValues, normalizedFactors);
    
    return {
      factor: factor.name,
      priority,
      currentValue: factor.current,
      normalizedValue: factor.value,
      action: rec.recommendation,
      targetValue: rec.targetValue
    };
  });
  
  return actions;
}

/**
 * Validate if a proposed change will actually improve photosynthesis
 * 
 * @param {string} factorToChange - "light", "co2", or "temperature"
 * @param {number} proposedValue - New value for the factor
 * @param {Object} currentValues - Current environmental values
 * @param {string} currentLimitingFactor - Current limiting factor
 * @returns {Object} { willImprove: boolean, reason: string }
 */
export function validateChange(factorToChange, proposedValue, currentValues, currentLimitingFactor) {
  // If changing a non-limiting factor, it won't help
  if (factorToChange !== currentLimitingFactor) {
    return {
      willImprove: false,
      reason: `Changing ${factorToChange} will not improve photosynthesis because ${currentLimitingFactor} is the limiting factor. According to the Law of Limiting Factors, you must address the weakest link first.`
    };
  }
  
  // Check if the proposed change is an improvement
  const currentValue = currentValues[factorToChange];
  
  if (factorToChange === "temperature") {
    // Temperature has an optimal range, not just "more is better"
    const optimal = 25;
    const currentDistance = Math.abs(currentValue - optimal);
    const proposedDistance = Math.abs(proposedValue - optimal);
    
    if (proposedDistance < currentDistance) {
      return {
        willImprove: true,
        reason: `Moving temperature closer to optimal (25°C) will improve enzyme efficiency and increase photosynthesis rate.`
      };
    } else {
      return {
        willImprove: false,
        reason: `This temperature change moves further from the optimal range (20-30°C). Consider moving toward 25°C instead.`
      };
    }
  } else {
    // Light and CO2: more is generally better (up to saturation)
    if (proposedValue > currentValue) {
      return {
        willImprove: true,
        reason: `Increasing ${factorToChange} will provide more ${factorToChange === 'light' ? 'photon energy' : 'substrate for carbon fixation'}, directly improving the photosynthesis rate.`
      };
    } else {
      return {
        willImprove: false,
        reason: `Decreasing ${factorToChange} will reduce photosynthesis rate. The current limitation requires an increase, not a decrease.`
      };
    }
  }
}

// BACKEND SCENARIO PRESETS - REAL-WORLD CONDITIONS (Backend-compatible values)
export const SCENARIO_PRESETS = {
  optimal: {
    light: 850,    // 85% = 850 μmol/m²/s  
    co2: 400,      // ppm
    temperature: 25 // °C
  },
  climate2050: {
    light: 750,    // 75% = 750 μmol/m²/s
    co2: 500,      // ppm
    temperature: 32 // °C
  },
  drought: {
    light: 850,    // 85% = 850 μmol/m²/s
    co2: 380,      // ppm
    temperature: 38 // °C
  },
  greenhouse: {
    light: 900,    // 90% = 900 μmol/m²/s
    co2: 600,      // ppm
    temperature: 26 // °C
  }
};