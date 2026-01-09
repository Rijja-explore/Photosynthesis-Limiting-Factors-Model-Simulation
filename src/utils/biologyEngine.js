/**
 * Advanced Biology Engine for Photosynthesis Simulation
 * Implements proper Law of Limiting Factors with realistic plant physiology
 */

// Optimal ranges for maximum photosynthetic efficiency
const OPTIMAL_CONDITIONS = {
  light: 85,        // μmol/m²/s (percentage of max)
  co2: 400,         // ppm
  temperature: 25   // °C
};

// Critical thresholds where plant survival is at risk
const CRITICAL_THRESHOLDS = {
  light: { min: 5, max: 100 },
  co2: { min: 150, max: 1000 },
  temperature: { min: 0, max: 50 }
};

// Stress response curves - how factors affect photosynthesis efficiency
const calculateFactorEfficiency = (value, optimal, min, max) => {
  if (value <= min || value >= max) return 0;
  
  // Use bell curve for temperature, asymptotic for light and CO2
  if (optimal === OPTIMAL_CONDITIONS.temperature) {
    // Temperature has sharp drop-off at extremes
    const deviation = Math.abs(value - optimal);
    return Math.max(0, 1 - Math.pow(deviation / 20, 2));
  } else if (optimal === OPTIMAL_CONDITIONS.light) {
    // Light has diminishing returns above optimal
    if (value <= optimal) {
      return Math.min(1, value / optimal);
    } else {
      return Math.max(0.7, 1 - ((value - optimal) / (100 - optimal)) * 0.3);
    }
  } else {
    // CO2 has saturation curve
    return Math.min(1, value / optimal);
  }
};

/**
 * Calculate photosynthesis rate using Law of Limiting Factors
 * Rate is limited by the MOST restrictive factor
 */
export const calculatePhotosynthesisRate = (factors) => {
  const { light, co2, temperature } = factors;
  
  // Calculate efficiency for each factor (0-1)
  const lightEfficiency = calculateFactorEfficiency(
    light, 
    OPTIMAL_CONDITIONS.light, 
    CRITICAL_THRESHOLDS.light.min, 
    CRITICAL_THRESHOLDS.light.max
  );
  
  const co2Efficiency = calculateFactorEfficiency(
    co2, 
    OPTIMAL_CONDITIONS.co2, 
    CRITICAL_THRESHOLDS.co2.min, 
    CRITICAL_THRESHOLDS.co2.max
  );
  
  const tempEfficiency = calculateFactorEfficiency(
    temperature, 
    OPTIMAL_CONDITIONS.temperature, 
    CRITICAL_THRESHOLDS.temperature.min, 
    CRITICAL_THRESHOLDS.temperature.max
  );
  
  // Law of Limiting Factors: rate = minimum efficiency
  const limitingEfficiency = Math.min(lightEfficiency, co2Efficiency, tempEfficiency);
  
  // Apply biological realism - exponential growth curves
  const photosynthesisRate = limitingEfficiency * 100;
  
  return {
    rate: Math.max(0, Math.min(100, photosynthesisRate)),
    efficiencies: {
      light: lightEfficiency,
      co2: co2Efficiency,
      temperature: tempEfficiency
    }
  };
};

/**
 * Identify which factor is limiting photosynthesis
 */
export const identifyLimitingFactor = (factors) => {
  const { efficiencies } = calculatePhotosynthesisRate(factors);
  
  // Find the factor with lowest efficiency
  const minEfficiency = Math.min(...Object.values(efficiencies));
  const limitingFactors = Object.entries(efficiencies)
    .filter(([, efficiency]) => efficiency === minEfficiency)
    .map(([factor]) => factor);
  
  // If multiple factors are equally limiting, prioritize by biological importance
  if (limitingFactors.includes('temperature')) return 'temperature';
  if (limitingFactors.includes('light')) return 'light';
  return 'co2';
};

/**
 * Generate intelligent explanations for current plant state
 */
export const generateExplanation = (factors, limitingFactor, photosynthesisRate) => {
  const { light, co2, temperature } = factors;
  const explanations = [];
  
  // Primary limiting factor explanation
  switch (limitingFactor) {
    case 'temperature':
      if (temperature < 10) {
        explanations.push({
          type: 'critical',
          title: 'Enzyme Shutdown',
          explanation: `At ${temperature}°C, photosynthetic enzymes are nearly inactive. RuBisCO cannot bind CO₂ efficiently, halting the Calvin cycle.`,
          biologicalReason: 'Cold temperatures reduce enzyme kinetic energy and protein flexibility.'
        });
      } else if (temperature > 40) {
        explanations.push({
          type: 'critical',
          title: 'Heat Stress',
          explanation: `Temperature of ${temperature}°C denatures photosynthetic proteins. Chlorophyll breaks down and stomata close to prevent water loss.`,
          biologicalReason: 'High heat disrupts protein structure and membrane stability.'
        });
      } else {
        explanations.push({
          type: 'moderate',
          title: 'Suboptimal Temperature',
          explanation: `Temperature deviates from the optimal 25°C range. Enzyme efficiency drops exponentially with temperature changes.`,
          biologicalReason: 'Enzyme active sites have specific temperature requirements for optimal function.'
        });
      }
      break;
      
    case 'light':
      if (light < 20) {
        explanations.push({
          type: 'critical',
          title: 'Light Starvation',
          explanation: `With only ${light}% light intensity, chlorophyll cannot capture enough photons to drive photosystem reactions.`,
          biologicalReason: 'Insufficient light energy limits ATP and NADPH production in the light reactions.'
        });
      } else {
        explanations.push({
          type: 'moderate',
          title: 'Light Limitation',
          explanation: `Current light intensity limits photon capture. Increasing light will directly boost photosynthetic rate.`,
          biologicalReason: 'Light energy drives the initial photosystem reactions that power carbon fixation.'
        });
      }
      break;
      
    case 'co2':
      if (co2 < 200) {
        explanations.push({
          type: 'critical',
          title: 'Carbon Starvation',
          explanation: `At ${co2} ppm CO₂, RuBisCO cannot find enough substrate for the Calvin cycle.`,
          biologicalReason: 'CO₂ is the raw material for carbon fixation in photosynthesis.'
        });
      } else {
        explanations.push({
          type: 'moderate',
          title: 'CO₂ Limitation',
          explanation: `CO₂ concentration limits carbon fixation rate. The Calvin cycle is substrate-limited.`,
          biologicalReason: 'RuBisCO enzyme efficiency depends on CO₂ availability for carboxylation reactions.'
        });
      }
      break;
  }
  
  // Secondary factor analysis
  if (photosynthesisRate > 80) {
    explanations.push({
      type: 'success',
      title: 'Optimal Conditions',
      explanation: 'All environmental factors are well-balanced. The plant is operating near maximum photosynthetic capacity.',
      biologicalReason: 'Efficient electron transport, carbon fixation, and enzyme function.'
    });
  }
  
  return explanations;
};

/**
 * Generate prioritized recommendations for optimization
 */
export const generateRecommendations = (factors, limitingFactor) => {
  const { light, co2, temperature } = factors;
  const recommendations = [];
  
  switch (limitingFactor) {
    case 'temperature':
      if (temperature > 35) {
        recommendations.push({
          action: `Reduce temperature by ${Math.round(temperature - 25)}°C`,
          impact: `Restore enzyme function and increase rate by ${Math.round((temperature - 25) * 3)}%`,
          priority: 'critical',
          method: 'Increase air circulation, add shade, or use cooling systems'
        });
      } else if (temperature < 15) {
        recommendations.push({
          action: `Increase temperature by ${Math.round(25 - temperature)}°C`,
          impact: `Restore enzyme activity and improve efficiency by ${Math.round((25 - temperature) * 4)}%`,
          priority: 'critical',
          method: 'Use heating systems, greenhouses, or thermal mass'
        });
      }
      break;
      
    case 'light':
      const lightIncrease = Math.min(90 - light, 30);
      recommendations.push({
        action: `Increase light intensity by ${lightIncrease}%`,
        impact: `Boost photon capture and improve glucose production by ${Math.round(lightIncrease * 1.8)}%`,
        priority: light < 30 ? 'critical' : 'high',
        method: 'Add grow lights, remove shade, or optimize plant positioning'
      });
      break;
      
    case 'co2':
      const co2Increase = Math.min(600 - co2, 150);
      recommendations.push({
        action: `Increase CO₂ by ${co2Increase} ppm`,
        impact: `Enhance carbon fixation and increase rate by ${Math.round(co2Increase * 0.4)}%`,
        priority: co2 < 250 ? 'high' : 'medium',
        method: 'Improve ventilation, add CO₂ supplementation, or organic decomposition'
      });
      break;
  }
  
  return recommendations;
};

/**
 * Calculate plant health score based on multiple factors
 */
export const calculatePlantHealth = (factors, photosynthesisRate, timeStressed = 0) => {
  let healthScore = photosynthesisRate;
  
  // Penalize for extreme conditions
  if (factors.temperature < 5 || factors.temperature > 45) healthScore *= 0.5;
  if (factors.light < 10) healthScore *= 0.7;
  if (factors.co2 < 180) healthScore *= 0.6;
  
  // Long-term stress effects
  if (timeStressed > 7) { // 7+ days of stress
    healthScore *= Math.max(0.3, 1 - (timeStressed - 7) * 0.05);
  }
  
  return Math.max(0, Math.min(100, healthScore));
};

/**
 * Simulate real-world scenarios with realistic parameter sets
 */
export const SCENARIO_PRESETS = {
  optimal: {
    name: 'Optimal Greenhouse',
    description: 'Perfect controlled environment for maximum growth',
    factors: { light: 85, co2: 400, temperature: 25 },
    expectedRate: 95
  },
  
  climate2050: {
    name: 'Climate Change 2050',
    description: 'Projected climate conditions with elevated CO₂ and temperature',
    factors: { light: 75, co2: 520, temperature: 32 },
    expectedRate: 65,
    challenges: ['Heat stress limits growth despite higher CO₂']
  },
  
  drought: {
    name: 'Drought Conditions',
    description: 'Hot, dry environment with limited water and extreme heat',
    factors: { light: 95, co2: 380, temperature: 42 },
    expectedRate: 25,
    challenges: ['Extreme heat shuts down photosynthesis', 'Stomata close to conserve water']
  },
  
  winter: {
    name: 'Winter Indoor',
    description: 'Low light, cold conditions typical of winter growing',
    factors: { light: 25, co2: 400, temperature: 15 },
    expectedRate: 30,
    challenges: ['Low light limits energy capture', 'Cold slows enzyme function']
  },
  
  rainforest: {
    name: 'Rainforest Floor',
    description: 'High humidity, low light under canopy',
    factors: { light: 15, co2: 390, temperature: 24 },
    expectedRate: 20,
    challenges: ['Severe light limitation under canopy']
  },
  
  desert: {
    name: 'Desert Noon',
    description: 'Intense light but extreme heat and low humidity',
    factors: { light: 100, co2: 380, temperature: 48 },
    expectedRate: 10,
    challenges: ['Extreme heat denatures proteins', 'Water stress closes stomata']
  }
};

export default {
  calculatePhotosynthesisRate,
  identifyLimitingFactor,
  generateExplanation,
  generateRecommendations,
  calculatePlantHealth,
  SCENARIO_PRESETS,
  OPTIMAL_CONDITIONS,
  CRITICAL_THRESHOLDS
};