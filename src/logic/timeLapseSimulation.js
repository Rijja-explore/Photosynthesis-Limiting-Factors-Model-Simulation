/**
 * timeLapseSimulation.js
 * Simulates plant growth over multiple days based on environmental conditions
 * 
 * Models cumulative effects of photosynthesis on plant biomass
 */

import { calculatePhotosynthesisRate } from './photosynthesisModel.js';
import { identifyLimitingFactor } from './limitingFactor.js';

/**
 * Simulate plant growth over multiple days
 * Growth accumulates based on daily photosynthesis rate
 * 
 * @param {Object} conditions - { light, co2, temperature } environmental parameters
 * @param {number} days - Number of days to simulate
 * @param {number} initialBiomass - Starting plant biomass (default: 100g)
 * @returns {Array} Daily simulation results
 */
export function simulateGrowth(conditions, days, initialBiomass = 100) {
  const { light, co2, temperature } = conditions;
  
  const results = [];
  let cumulativeGrowth = initialBiomass;
  let cumulativeStress = 0; // Tracks prolonged suboptimal conditions
  
  for (let day = 1; day <= days; day++) {
    // Calculate photosynthesis rate for this day
    const photoResult = calculatePhotosynthesisRate(light, co2, temperature);
    const rate = photoResult.rate;
    
    // Convert photosynthesis rate to daily biomass gain
    // Assumes optimal conditions (rate = 1.0) = 5% daily growth
    const dailyGrowthRate = rate * 0.05; // 0-5% per day
    const biomassGain = cumulativeGrowth * dailyGrowthRate;
    
    cumulativeGrowth += biomassGain;
    
    // Track stress if conditions are poor (rate < 0.4)
    if (rate < 0.4) {
      cumulativeStress += (0.4 - rate); // Accumulate stress
      // Apply stress penalty: reduced growth efficiency over time
      const stressPenalty = Math.min(cumulativeStress * 0.02, 0.3); // Max 30% penalty
      cumulativeGrowth -= cumulativeGrowth * stressPenalty * 0.01; // Small daily penalty
    } else {
      // Recovery: stress decreases if conditions improve
      cumulativeStress = Math.max(0, cumulativeStress - 0.1);
    }
    
    // Identify limiting factor for this day
    const limiting = identifyLimitingFactor(photoResult.factors);
    
    results.push({
      day,
      rate: Math.round(rate * 1000) / 1000, // Round to 3 decimals
      biomass: Math.round(cumulativeGrowth * 100) / 100, // Round to 2 decimals
      dailyGain: Math.round(biomassGain * 100) / 100,
      limitingFactor: limiting.limitingFactor,
      stress: Math.round(cumulativeStress * 100) / 100,
      efficiency: Math.round(rate * 100) // Percentage
    });
  }
  
  return results;
}

/**
 * Compare growth under different environmental scenarios
 * Useful for showing the impact of changing one variable
 * 
 * @param {Object} baseConditions - Baseline { light, co2, temperature }
 * @param {Object} altConditions - Alternative { light, co2, temperature }
 * @param {number} days - Number of days to simulate
 * @returns {Object} Comparison results
 */
export function compareScenarios(baseConditions, altConditions, days) {
  const baseGrowth = simulateGrowth(baseConditions, days);
  const altGrowth = simulateGrowth(altConditions, days);
  
  // Calculate final differences
  const baseFinal = baseGrowth[baseGrowth.length - 1];
  const altFinal = altGrowth[altGrowth.length - 1];
  
  const biomassDifference = altFinal.biomass - baseFinal.biomass;
  const percentImprovement = ((biomassDifference / baseFinal.biomass) * 100);
  
  return {
    baseline: baseGrowth,
    alternative: altGrowth,
    comparison: {
      baselineFinalBiomass: baseFinal.biomass,
      alternativeFinalBiomass: altFinal.biomass,
      biomassDifference: Math.round(biomassDifference * 100) / 100,
      percentImprovement: Math.round(percentImprovement * 10) / 10,
      betterScenario: biomassDifference > 0 ? "alternative" : "baseline"
    }
  };
}

/**
 * Simulate variable conditions over time (e.g., day/night cycles, seasonal changes)
 * Conditions can change each day based on a pattern
 * 
 * @param {Function} conditionGenerator - Function that takes day number and returns { light, co2, temperature }
 * @param {number} days - Number of days to simulate
 * @param {number} initialBiomass - Starting biomass
 * @returns {Array} Daily simulation results with varying conditions
 */
export function simulateVariableConditions(conditionGenerator, days, initialBiomass = 100) {
  const results = [];
  let cumulativeGrowth = initialBiomass;
  let cumulativeStress = 0;
  
  for (let day = 1; day <= days; day++) {
    // Get conditions for this specific day
    const conditions = conditionGenerator(day);
    const { light, co2, temperature } = conditions;
    
    // Calculate photosynthesis
    const photoResult = calculatePhotosynthesisRate(light, co2, temperature);
    const rate = photoResult.rate;
    
    // Growth calculation
    const dailyGrowthRate = rate * 0.05;
    const biomassGain = cumulativeGrowth * dailyGrowthRate;
    cumulativeGrowth += biomassGain;
    
    // Stress tracking
    if (rate < 0.4) {
      cumulativeStress += (0.4 - rate);
      const stressPenalty = Math.min(cumulativeStress * 0.02, 0.3);
      cumulativeGrowth -= cumulativeGrowth * stressPenalty * 0.01;
    } else {
      cumulativeStress = Math.max(0, cumulativeStress - 0.1);
    }
    
    const limiting = identifyLimitingFactor(photoResult.factors);
    
    results.push({
      day,
      conditions: { light, co2, temperature },
      rate: Math.round(rate * 1000) / 1000,
      biomass: Math.round(cumulativeGrowth * 100) / 100,
      dailyGain: Math.round(biomassGain * 100) / 100,
      limitingFactor: limiting.limitingFactor,
      stress: Math.round(cumulativeStress * 100) / 100,
      efficiency: Math.round(rate * 100)
    });
  }
  
  return results;
}

/**
 * Calculate optimal growth trajectory (theoretical maximum)
 * Assumes perfect conditions (all factors = 1.0) throughout
 * 
 * @param {number} days - Number of days
 * @param {number} initialBiomass - Starting biomass
 * @returns {Array} Optimal growth trajectory
 */
export function calculateOptimalTrajectory(days, initialBiomass = 100) {
  const optimalConditions = {
    light: 800,    // Optimal light
    co2: 500,      // Enriched CO2
    temperature: 25 // Optimal temperature
  };
  
  return simulateGrowth(optimalConditions, days, initialBiomass);
}

/**
 * Analyze growth efficiency over time period
 * Returns summary statistics for the simulation
 * 
 * @param {Array} simulationResults - Output from simulateGrowth
 * @returns {Object} Summary statistics
 */
export function analyzeGrowthEfficiency(simulationResults) {
  if (!simulationResults || simulationResults.length === 0) {
    return null;
  }
  
  const rates = simulationResults.map(r => r.rate);
  const avgRate = rates.reduce((sum, r) => sum + r, 0) / rates.length;
  const minRate = Math.min(...rates);
  const maxRate = Math.max(...rates);
  
  const initialBiomass = simulationResults[0].biomass - simulationResults[0].dailyGain;
  const finalBiomass = simulationResults[simulationResults.length - 1].biomass;
  const totalGrowth = finalBiomass - initialBiomass;
  const growthRate = (totalGrowth / initialBiomass) * 100; // Percentage
  
  // Count days by limiting factor
  const limitingFactorCounts = simulationResults.reduce((counts, day) => {
    counts[day.limitingFactor] = (counts[day.limitingFactor] || 0) + 1;
    return counts;
  }, {});
  
  const mostCommonLimiting = Object.entries(limitingFactorCounts)
    .sort((a, b) => b[1] - a[1])[0][0];
  
  return {
    averageEfficiency: Math.round(avgRate * 100),
    minEfficiency: Math.round(minRate * 100),
    maxEfficiency: Math.round(maxRate * 100),
    totalGrowth: Math.round(totalGrowth * 100) / 100,
    growthRate: Math.round(growthRate * 10) / 10,
    initialBiomass: Math.round(initialBiomass * 100) / 100,
    finalBiomass: Math.round(finalBiomass * 100) / 100,
    mostCommonLimitingFactor: mostCommonLimiting,
    limitingFactorDistribution: limitingFactorCounts,
    days: simulationResults.length
  };
}