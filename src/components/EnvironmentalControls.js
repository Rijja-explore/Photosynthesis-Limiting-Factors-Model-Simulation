import React from 'react';

const EnvironmentalControls = ({ factors, onChange, limitingFactor }) => {
  
  // Simple conversion functions
  const getDisplayPercentage = (factor, backendValue) => {
    switch (factor) {
      case 'light':
        return Math.round((backendValue / 1000) * 100);
      case 'co2':
        return Math.round(((backendValue - 100) / 900) * 100);
      case 'temperature':
        return Math.round((backendValue / 45) * 100);
      default:
        return 50;
    }
  };
  
  const getBackendValue = (factor, percentage) => {
    switch (factor) {
      case 'light':
        return (percentage / 100) * 1000;
      case 'co2':
        return 100 + (percentage / 100) * 900;
      case 'temperature':
        return (percentage / 100) * 45;
      default:
        return percentage;
    }
  };
  
  const getDisplayText = (factor, backendValue) => {
    switch (factor) {
      case 'light':
        return `${Math.round((backendValue / 1000) * 100)}% Light`;
      case 'co2':
        return `${Math.round(backendValue)} ppm CO₂`;
      case 'temperature':
        return `${Math.round(backendValue)}°C`;
      default:
        return 'Unknown';
    }
  };

  const SimpleSlider = ({ factor, label }) => {
    const backendValue = factors[factor] || 0;
    const displayPercentage = getDisplayPercentage(factor, backendValue);
    const isLimiting = limitingFactor === factor;
    
    return (
      <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 mb-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">{label}</h3>
            <p className="text-sm text-gray-400">{getDisplayText(factor, backendValue)}</p>
          </div>
          {isLimiting && (
            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
              LIMITING
            </span>
          )}
        </div>
        
        {/* Slider Container */}
        <div className="relative">
          {/* Track */}
          <div className="w-full h-6 bg-slate-700 rounded-lg relative overflow-hidden">
            {/* Fill */}
            <div 
              className={`h-full bg-gradient-to-r ${
                isLimiting ? 'from-red-500 to-red-600' : 
                factor === 'light' ? 'from-yellow-400 to-yellow-500' :
                factor === 'co2' ? 'from-blue-400 to-blue-500' :
                'from-green-400 to-green-500'
              } transition-all duration-200`}
              style={{ width: `${displayPercentage}%` }}
            />
          </div>
          
          {/* Actual Slider */}
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={displayPercentage}
            onChange={(e) => {
              const newPercentage = parseInt(e.target.value);
              const newBackendValue = getBackendValue(factor, newPercentage);
              console.log(`${factor}: ${newPercentage}% → ${Math.round(newBackendValue)}`);
              onChange(factor, newBackendValue);
            }}
            className="absolute top-0 left-0 w-full h-6 opacity-0 cursor-pointer"
          />
          
          {/* Thumb */}
          <div
            className="absolute top-1 w-4 h-4 bg-white rounded-full border-2 border-gray-300 pointer-events-none"
            style={{
              left: `calc(${displayPercentage}% - 8px)`,
              transform: isLimiting ? 'scale(1.2)' : 'scale(1)'
            }}
          />
        </div>
        
        {/* Percentage Display */}
        <div className="mt-2 text-center">
          <span className="text-white text-sm font-mono">{displayPercentage}%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Environmental Controls</h2>
        <p className="text-gray-400">Adjust conditions to optimize photosynthesis</p>
      </div>

      <SimpleSlider factor="light" label="Light Intensity" />
      <SimpleSlider factor="co2" label="CO₂ Concentration" />
      <SimpleSlider factor="temperature" label="Temperature" />

      {/* Summary */}
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
        <h4 className="font-semibold text-white mb-2">Current Environment</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-yellow-400 font-semibold">
              {Math.round((factors.light / 1000) * 100)}%
            </div>
            <div className="text-gray-400">Light</div>
          </div>
          <div className="text-center">
            <div className="text-blue-400 font-semibold">
              {Math.round(factors.co2)}
            </div>
            <div className="text-gray-400">ppm CO₂</div>
          </div>
          <div className="text-center">
            <div className="text-green-400 font-semibold">
              {Math.round(factors.temperature)}°C
            </div>
            <div className="text-gray-400">Temp</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalControls;