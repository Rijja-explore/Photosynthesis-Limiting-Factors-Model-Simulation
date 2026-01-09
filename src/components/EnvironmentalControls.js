import React from 'react';
import { motion } from 'framer-motion';

const EnvironmentalControls = ({ factors, onChange, limitingFactor }) => {
  const getSliderColor = (factor) => {
    if (limitingFactor === factor) return 'from-red-500 to-red-600';
    
    const value = factors[factor];
    switch (factor) {
      case 'light':
        if (value > 80) return 'from-yellow-400 to-yellow-500';
        if (value > 40) return 'from-yellow-300 to-yellow-400';
        return 'from-yellow-200 to-yellow-300';
      case 'co2':
        return 'from-blue-400 to-blue-500';
      case 'temperature':
        if (value > 30) return 'from-red-400 to-red-500';
        if (value > 20) return 'from-green-400 to-green-500';
        return 'from-blue-400 to-blue-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getDangerZone = (factor) => {
    switch (factor) {
      case 'light':
        return { min: 0, warn: 30, optimal: 60, max: 100 };
      case 'co2':
        return { min: 100, warn: 250, optimal: 400, max: 1000 };
      case 'temperature':
        return { min: 0, warn: 15, optimal: 25, max: 45 };
      default:
        return { min: 0, warn: 25, optimal: 50, max: 100 };
    }
  };

  const getDisplayValue = (factor, value) => {
    switch (factor) {
      case 'light':
        return `${value}% intensity`;
      case 'co2':
        return `${value} ppm`;
      case 'temperature':
        return `${value}°C`;
      default:
        return value;
    }
  };

  const getIcon = (factor) => {
    switch (factor) {
      case 'light':
        return (
          <motion.div
            className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center"
            animate={{ 
              scale: factors.light > 70 ? [1, 1.1, 1] : 1,
              boxShadow: factors.light > 70 ? 
                ['0 0 0 rgba(251, 191, 36, 0)', '0 0 20px rgba(251, 191, 36, 0.5)', '0 0 0 rgba(251, 191, 36, 0)'] 
                : '0 0 0 rgba(251, 191, 36, 0)'
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ☀️
          </motion.div>
        );
      case 'co2':
        return (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
            CO₂
          </div>
        );
      case 'temperature':
        return (
          <motion.div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-lg ${
              factors.temperature > 35 ? 'bg-gradient-to-br from-red-500 to-red-600' :
              factors.temperature > 20 ? 'bg-gradient-to-br from-green-500 to-green-600' :
              'bg-gradient-to-br from-blue-500 to-blue-600'
            }`}
            animate={factors.temperature > 35 ? { 
              scale: [1, 1.1, 1],
              boxShadow: ['0 0 0 rgba(239, 68, 68, 0)', '0 0 20px rgba(239, 68, 68, 0.5)', '0 0 0 rgba(239, 68, 68, 0)']
            } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          >
            🌡️
          </motion.div>
        );
      default:
        return null;
    }
  };

  const SliderControl = ({ factor, label, min, max, step = 1 }) => {
    const zones = getDangerZone(factor);
    const value = factors[factor];
    const percentage = ((value - min) / (max - min)) * 100;

    return (
      <motion.div
        className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-4">
          {getIcon(factor)}
          <div>
            <h3 className="text-lg font-bold text-white">{label}</h3>
            <p className="text-sm text-gray-400">{getDisplayValue(factor, value)}</p>
          </div>
          {limitingFactor === factor && (
            <motion.div
              className="ml-auto px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              LIMITING
            </motion.div>
          )}
        </div>

        {/* Slider track with zones */}
        <div className="relative mb-4">
          <div className="h-6 bg-slate-700 rounded-lg relative overflow-hidden">
            {/* Danger zones */}
            <div 
              className="absolute top-0 left-0 h-full bg-red-500 opacity-30"
              style={{ 
                width: `${((zones.warn - min) / (max - min)) * 100}%` 
              }}
            ></div>
            <div 
              className="absolute top-0 h-full bg-red-500 opacity-30"
              style={{ 
                left: `${((zones.optimal + 10 - min) / (max - min)) * 100}%`,
                width: `${((max - zones.optimal - 10) / (max - min)) * 100}%` 
              }}
            ></div>
            
            {/* Optimal zone */}
            <div 
              className="absolute top-0 h-full bg-green-500 opacity-20"
              style={{ 
                left: `${((zones.optimal - 5 - min) / (max - min)) * 100}%`,
                width: `${(10 / (max - min)) * 100}%` 
              }}
            ></div>

            {/* Progress fill */}
            <motion.div
              className={`absolute top-0 left-0 h-full bg-gradient-to-r ${getSliderColor(factor)} rounded-lg`}
              style={{ width: `${percentage}%` }}
              animate={{ opacity: limitingFactor === factor ? [0.8, 1, 0.8] : 1 }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </div>

          {/* Slider thumb */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(factor, Number(e.target.value))}
            className="absolute top-0 w-full h-6 opacity-0 cursor-pointer"
          />
          
          <motion.div
            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-slate-300 pointer-events-none"
            style={{ 
              left: `calc(${percentage}% - 8px)`,
              top: '4px'
            }}
            animate={limitingFactor === factor ? { 
              scale: [1, 1.2, 1],
              boxShadow: ['0 0 0 rgba(239, 68, 68, 0)', '0 0 10px rgba(239, 68, 68, 0.8)', '0 0 0 rgba(239, 68, 68, 0)']
            } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>

        {/* Zone labels */}
        <div className="flex justify-between text-xs text-gray-400">
          <span>Min</span>
          <span className="text-red-400">Danger</span>
          <span className="text-green-400">Optimal</span>
          <span className="text-red-400">Danger</span>
          <span>Max</span>
        </div>

        {/* Real-time feedback */}
        {limitingFactor === factor && (
          <motion.div
            className="mt-3 p-2 bg-red-900 border border-red-500 rounded-lg text-red-200 text-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            ⚠️ This factor is currently limiting photosynthesis
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Environmental Controls</h2>
        <p className="text-gray-400">Adjust conditions to optimize photosynthesis</p>
      </div>

      <SliderControl
        factor="light"
        label="Light Intensity"
        min={0}
        max={100}
        step={1}
      />

      <SliderControl
        factor="co2"
        label="CO₂ Concentration"
        min={100}
        max={1000}
        step={10}
      />

      <SliderControl
        factor="temperature"
        label="Temperature"
        min={0}
        max={45}
        step={1}
      />

      {/* Environmental summary */}
      <motion.div
        className="bg-slate-800 rounded-xl p-4 border border-slate-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h4 className="font-semibold text-white mb-2">Current Environment</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-yellow-400 font-semibold">{factors.light}%</div>
            <div className="text-gray-400">Light</div>
          </div>
          <div className="text-center">
            <div className="text-blue-400 font-semibold">{factors.co2}</div>
            <div className="text-gray-400">ppm CO₂</div>
          </div>
          <div className="text-center">
            <div className={`font-semibold ${
              factors.temperature > 35 ? 'text-red-400' :
              factors.temperature < 15 ? 'text-blue-400' :
              'text-green-400'
            }`}>
              {factors.temperature}°C
            </div>
            <div className="text-gray-400">Temp</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EnvironmentalControls;