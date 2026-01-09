import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { runTimeLapseSimulation } from '../utils/photosynthesisLogic';

const TimeLapse = ({ active, onToggle, plantHistory, environmentalFactors, currentPhotosynthesisRate }) => {
  const [timeScale, setTimeScale] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDay, setCurrentDay] = useState(0);
  const [simulationData, setSimulationData] = useState([]);

  // Regenerate simulation data when environmental factors change
  useEffect(() => {
    const generateTimelapseData = () => {
      // Use actual logic-based simulation if environmental factors provided
      if (environmentalFactors && environmentalFactors.light !== undefined) {
        // Create dynamic simulation based on CURRENT environmental conditions
        const currentConditions = {
          light: environmentalFactors.light,
          co2: environmentalFactors.co2,
          temperature: environmentalFactors.temperature
        };
        
        const simulationData = runTimeLapseSimulation(currentConditions, 30);
        
        return simulationData.map((point, index) => ({
          day: point.time || index + 1,
          photosynthesisRate: (point.rate * 100),
          growth: Math.min(100, (point.rate * 100)),
          health: Math.min(100, Math.max(10, point.rate * 100)),
          light: currentConditions.light,
          co2: currentConditions.co2,
          temperature: currentConditions.temperature
        }));
      }
      
      // Fallback if no factors provided
      if (!plantHistory || plantHistory.length === 0) return [];
      
      const data = [];
      const startingHealth = plantHistory[0]?.health || 85;
      
      for (let day = 0; day < 30; day++) {
        const currentFactors = plantHistory[Math.min(day, plantHistory.length - 1)]?.factors || {
          light: 70, co2: 400, temperature: 25
        };
        
        let healthChange = 0;
        
        if (currentFactors.temperature > 35) {
          healthChange -= (currentFactors.temperature - 35) * 0.5 * (day + 1) * 0.1;
        } else if (currentFactors.temperature < 15) {
          healthChange -= (15 - currentFactors.temperature) * 0.3 * (day + 1) * 0.1;
        }
        
        if (currentFactors.light < 50) {
          healthChange -= (50 - currentFactors.light) * 0.2 * (day + 1) * 0.05;
        }
        
        if (currentFactors.co2 < 300) {
          healthChange -= (300 - currentFactors.co2) * 0.1;
        }
        
        const health = Math.max(0, Math.min(100, startingHealth + healthChange));
        
        data.push({
          day: day + 1,
          health,
          light: currentFactors.light,
          co2: currentFactors.co2,
          temperature: currentFactors.temperature,
          photosynthesisRate: Math.min(100, health * 0.9)
        });
      }
      
      return data;
    };

    if (active) {
      const newData = generateTimelapseData();
      setSimulationData(newData);
      // Reset to day 0 when conditions change for immediate visual feedback
      setCurrentDay(0);
      setIsPlaying(false);
    }
  }, [environmentalFactors, active, plantHistory]);

  useEffect(() => {
    if (isPlaying && active) {
      const interval = setInterval(() => {
        setCurrentDay(prev => {
          if (prev >= 29) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000 / timeScale);

      return () => clearInterval(interval);
    }
  }, [isPlaying, active, timeScale]);

  // Use cached simulation data or fallback
  const timelapseData = simulationData.length > 0 ? simulationData : [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl">
          <p className="text-white font-semibold">{`Day ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${entry.value.toFixed(1)}${entry.name === 'Temperature' ? '°C' : entry.name === 'CO2' ? ' ppm' : entry.name === 'Light' ? '%' : '%'}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getHealthStatus = (health) => {
    if (health > 80) return { status: 'Thriving', color: 'text-green-400', icon: '🌟' };
    if (health > 60) return { status: 'Healthy', color: 'text-green-300', icon: '🌱' };
    if (health > 30) return { status: 'Stressed', color: 'text-yellow-400', icon: '⚠️' };
    return { status: 'Critical', color: 'text-red-400', icon: '🆘' };
  };

  const currentData = timelapseData[currentDay] || {};
  const healthStatus = getHealthStatus(currentData.health || 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">30-Day Time-Lapse</h2>
          <p className="text-gray-400">Observe long-term plant response patterns</p>
          {environmentalFactors && (
            <div className="mt-2 text-sm text-blue-300">
              <span className="bg-slate-700 px-2 py-1 rounded mr-2">
                Current: {environmentalFactors.light}% Light, {environmentalFactors.co2}ppm CO₂, {environmentalFactors.temperature}°C
              </span>
            </div>
          )}
        </div>
        <motion.button
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            active
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
              : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
          }`}
          onClick={() => onToggle(!active)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {active ? 'Stop Simulation' : 'Simulate 30 Days'}
        </motion.button>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <motion.button
                  className="p-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-semibold transition-colors"
                  onClick={() => setIsPlaying(!isPlaying)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </motion.button>
                
                <button
                  className="p-3 bg-gray-600 hover:bg-gray-500 rounded-lg text-white transition-colors"
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentDay(0);
                  }}
                >
                  Reset
                </button>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm">Speed:</span>
                <select
                  value={timeScale}
                  onChange={(e) => setTimeScale(Number(e.target.value))}
                  className="bg-slate-700 text-white rounded-lg px-3 py-1 text-sm border border-slate-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={1}>1x</option>
                  <option value={2}>2x</option>
                  <option value={5}>5x</option>
                </select>
              </div>
            </div>

            <motion.div
              className="bg-slate-700 rounded-lg p-4 mb-6"
              key={currentDay}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Day {currentDay + 1}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg">{healthStatus.icon}</span>
                    <span className={`font-semibold ${healthStatus.color}`}>
                      {healthStatus.status}
                    </span>
                    <span className="text-gray-400">·</span>
                    <span className="text-gray-300">
                      {currentData.health?.toFixed(1)}% Health
                    </span>
                  </div>
                </div>
                
                <div className="text-right text-sm text-gray-400">
                  <div>Photosynthesis: {currentData.photosynthesisRate?.toFixed(1)}%</div>
                  <div>Light: {currentData.light}% | CO2: {currentData.co2}ppm | {currentData.temperature}°C</div>
                </div>
              </div>
            </motion.div>

            <div className="mb-6">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Day 1</span>
                <span>Day 15</span>
                <span>Day 30</span>
              </div>
              <div className="relative">
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-green-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentDay + 1) / 30) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <motion.div
                  className="absolute top-0 w-4 h-4 bg-white rounded-full border-2 border-blue-500 -mt-1"
                  style={{ left: `calc(${((currentDay + 1) / 30) * 100}% - 8px)` }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: isPlaying ? Infinity : 0 }}
                />
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-3">Health Over Time</h4>
              <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                  <AreaChart data={timelapseData.slice(0, currentDay + 1)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="day" 
                      stroke="#9CA3AF"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      tick={{ fontSize: 12 }}
                      domain={[0, 100]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="health"
                      stroke="#22C55E"
                      fill="#22C55E"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Environmental Conditions</h4>
              <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                  <LineChart data={timelapseData.slice(0, currentDay + 1)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="day" 
                      stroke="#9CA3AF"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="light"
                      stroke="#FBBF24"
                      strokeWidth={2}
                      name="Light"
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke="#EF4444"
                      strokeWidth={2}
                      name="Temperature"
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {currentDay > 0 && (
              <motion.div
                className="mt-6 p-4 bg-slate-700 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h4 className="font-semibold text-white mb-2">Timeline Events</h4>
                <div className="space-y-1 text-sm text-gray-300">
                  {currentDay >= 7 && <p>• Day 7: First signs of environmental adaptation</p>}
                  {currentDay >= 14 && <p>• Day 14: Metabolic adjustment patterns established</p>}
                  {currentDay >= 21 && <p>• Day 21: Long-term stress responses activated</p>}
                  {currentDay === 30 && <p>• Day 30: Complete adaptation cycle observed</p>}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TimeLapse;