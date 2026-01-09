import React from 'react';
import { motion } from 'framer-motion';

const PlantVisualization = ({ health, factors, limitingFactor }) => {
  const getPlantState = () => {
    if (health > 80) return 'thriving';
    if (health > 60) return 'healthy';
    if (health > 30) return 'stressed';
    return 'critical';
  };

  const getLeafColor = () => {
    const state = getPlantState();
    switch (state) {
      case 'thriving': return '#22c55e';
      case 'healthy': return '#65a30d';
      case 'stressed': return '#eab308';
      case 'critical': return '#dc2626';
      default: return '#22c55e';
    }
  };

  const getStemColor = () => {
    const state = getPlantState();
    switch (state) {
      case 'thriving': return '#166534';
      case 'healthy': return '#365314';
      case 'stressed': return '#a16207';
      case 'critical': return '#991b1b';
      default: return '#166534';
    }
  };

  const getAnimationProps = () => {
    const state = getPlantState();
    switch (state) {
      case 'thriving':
        return {
          animate: { 
            y: [0, -2, 0],
            scale: [1, 1.02, 1],
          },
          transition: { 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut"
          }
        };
      case 'healthy':
        return {
          animate: { 
            y: [0, -1, 0],
            scale: [1, 1.01, 1],
          },
          transition: { 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut"
          }
        };
      case 'stressed':
        return {
          animate: { 
            x: [0, 1, -1, 0],
            rotate: [0, 0.5, -0.5, 0]
          },
          transition: { 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }
        };
      case 'critical':
        return {
          animate: { 
            x: [0, 2, -2, 1, -1, 0],
            y: [0, 1, 1, 0],
            rotate: [0, 1, -1, 0.5, -0.5, 0]
          },
          transition: { 
            duration: 1, 
            repeat: Infinity,
            ease: "easeInOut"
          }
        };
      default:
        return {};
    }
  };

  const getHealthRingColor = () => {
    if (health > 80) return '#22c55e';
    if (health > 60) return '#84cc16';
    if (health > 30) return '#eab308';
    return '#dc2626';
  };

  const getStressIndicators = () => {
    const indicators = [];
    
    if (limitingFactor === 'temperature' && factors.temperature > 35) {
      indicators.push(
        <g key="heat-stress">
          <motion.path
            d="M 200 80 Q 210 70 220 80 Q 210 90 200 80"
            fill="rgba(239, 68, 68, 0.6)"
            animate={{ 
              d: [
                "M 200 80 Q 210 70 220 80 Q 210 90 200 80",
                "M 200 85 Q 210 75 220 85 Q 210 95 200 85",
                "M 200 80 Q 210 70 220 80 Q 210 90 200 80"
              ]
            }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <text x="230" y="85" fill="#dc2626" fontSize="12" className="font-medium">
            Heat Stress
          </text>
        </g>
      );
    }

    if (limitingFactor === 'temperature' && factors.temperature < 15) {
      indicators.push(
        <g key="cold-stress">
          <motion.circle
            cx="200"
            cy="80"
            r="8"
            fill="rgba(59, 130, 246, 0.6)"
            animate={{ r: [6, 10, 6] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <text x="220" y="85" fill="#3b82f6" fontSize="12" className="font-medium">
            Cold Stress
          </text>
        </g>
      );
    }

    if (limitingFactor === 'light' && factors.light < 40) {
      indicators.push(
        <g key="light-stress">
          <motion.rect
            x="180"
            y="120"
            width="40"
            height="3"
            fill="rgba(251, 191, 36, 0.8)"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <text x="190" y="140" fill="#fbbf24" fontSize="12" className="font-medium">
            Light Deficient
          </text>
        </g>
      );
    }

    return indicators;
  };

  return (
    <div className="relative w-full max-w-md mx-auto bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-8 shadow-2xl">
      {/* Health Ring */}
      <div className="absolute inset-4 rounded-2xl border-4 border-opacity-30"
           style={{ borderColor: getHealthRingColor() }}>
        <div className="absolute -top-2 -right-2 bg-slate-700 px-2 py-1 rounded-lg text-sm font-medium">
          {health}% Health
        </div>
      </div>

      {/* Plant SVG */}
      <motion.svg
        width="100%"
        height="400"
        viewBox="0 0 400 400"
        className="drop-shadow-lg"
        {...getAnimationProps()}
      >
        {/* Soil */}
        <rect x="0" y="350" width="400" height="50" fill="#92400e" rx="5"/>
        
        {/* Main Stem */}
        <motion.rect
          x="195"
          y="200"
          width="10"
          height="150"
          fill={getStemColor()}
          rx="5"
          animate={getPlantState() === 'critical' ? { height: [150, 140, 150] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Leaves */}
        <motion.g>
          {/* Left leaves */}
          <motion.ellipse
            cx="160"
            cy="180"
            rx="35"
            ry="15"
            fill={getLeafColor()}
            transform="rotate(-30 160 180)"
            animate={getPlantState() === 'thriving' ? { 
              rx: [35, 38, 35], 
              ry: [15, 17, 15] 
            } : getPlantState() === 'critical' ? {
              rx: [35, 30, 35],
              ry: [15, 12, 15]
            } : {}}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.ellipse
            cx="150"
            cy="220"
            rx="40"
            ry="18"
            fill={getLeafColor()}
            transform="rotate(-45 150 220)"
            animate={getPlantState() === 'thriving' ? { 
              rx: [40, 43, 40], 
              ry: [18, 20, 18] 
            } : getPlantState() === 'critical' ? {
              rx: [40, 35, 40],
              ry: [18, 15, 18]
            } : {}}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          />
          <motion.ellipse
            cx="155"
            cy="260"
            rx="38"
            ry="16"
            fill={getLeafColor()}
            transform="rotate(-35 155 260)"
            animate={getPlantState() === 'thriving' ? { 
              rx: [38, 41, 38], 
              ry: [16, 18, 16] 
            } : getPlantState() === 'critical' ? {
              rx: [38, 33, 38],
              ry: [16, 13, 16]
            } : {}}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          />

          {/* Right leaves */}
          <motion.ellipse
            cx="240"
            cy="180"
            rx="35"
            ry="15"
            fill={getLeafColor()}
            transform="rotate(30 240 180)"
            animate={getPlantState() === 'thriving' ? { 
              rx: [35, 38, 35], 
              ry: [15, 17, 15] 
            } : getPlantState() === 'critical' ? {
              rx: [35, 30, 35],
              ry: [15, 12, 15]
            } : {}}
            transition={{ duration: 3, repeat: Infinity, delay: 0.2 }}
          />
          <motion.ellipse
            cx="250"
            cy="220"
            rx="40"
            ry="18"
            fill={getLeafColor()}
            transform="rotate(45 250 220)"
            animate={getPlantState() === 'thriving' ? { 
              rx: [40, 43, 40], 
              ry: [18, 20, 18] 
            } : getPlantState() === 'critical' ? {
              rx: [40, 35, 40],
              ry: [18, 15, 18]
            } : {}}
            transition={{ duration: 3, repeat: Infinity, delay: 0.7 }}
          />
          <motion.ellipse
            cx="245"
            cy="260"
            rx="38"
            ry="16"
            fill={getLeafColor()}
            transform="rotate(35 245 260)"
            animate={getPlantState() === 'thriving' ? { 
              rx: [38, 41, 38], 
              ry: [16, 18, 16] 
            } : getPlantState() === 'critical' ? {
              rx: [38, 33, 38],
              ry: [16, 13, 16]
            } : {}}
            transition={{ duration: 3, repeat: Infinity, delay: 1.2 }}
          />

          {/* Top leaves */}
          <motion.ellipse
            cx="180"
            cy="160"
            rx="32"
            ry="14"
            fill={getLeafColor()}
            transform="rotate(-15 180 160)"
            animate={getPlantState() === 'thriving' ? { 
              rx: [32, 35, 32], 
              ry: [14, 16, 14] 
            } : getPlantState() === 'critical' ? {
              rx: [32, 27, 32],
              ry: [14, 11, 14]
            } : {}}
            transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
          />
          <motion.ellipse
            cx="220"
            cy="160"
            rx="32"
            ry="14"
            fill={getLeafColor()}
            transform="rotate(15 220 160)"
            animate={getPlantState() === 'thriving' ? { 
              rx: [32, 35, 32], 
              ry: [14, 16, 14] 
            } : getPlantState() === 'critical' ? {
              rx: [32, 27, 32],
              ry: [14, 11, 14]
            } : {}}
            transition={{ duration: 3, repeat: Infinity, delay: 1.7 }}
          />
        </motion.g>

        {/* Environmental particles */}
        {factors.light > 60 && (
          <g>
            {[...Array(5)].map((_, i) => (
              <motion.circle
                key={`light-${i}`}
                cx={50 + i * 70}
                cy={30 + Math.random() * 20}
                r="3"
                fill="#fbbf24"
                animate={{
                  y: [0, 400],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: "linear"
                }}
              />
            ))}
          </g>
        )}

        {factors.co2 > 300 && (
          <g>
            {[...Array(3)].map((_, i) => (
              <motion.circle
                key={`co2-${i}`}
                cx={100 + i * 100}
                cy={350}
                r="4"
                fill="rgba(148, 163, 184, 0.7)"
                animate={{
                  y: [0, -100],
                  x: [0, 20, -20, 0],
                  opacity: [1, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 0.8,
                  ease: "easeOut"
                }}
              />
            ))}
          </g>
        )}

        {/* Stress indicators */}
        {getStressIndicators()}
      </motion.svg>

      {/* Plant State Display */}
      <div className="mt-4 text-center">
        <motion.div
          className={`text-lg font-bold ${
            getPlantState() === 'thriving' ? 'text-plant-green-400' :
            getPlantState() === 'healthy' ? 'text-plant-green-500' :
            getPlantState() === 'stressed' ? 'text-stress-yellow-400' :
            'text-danger-red-400'
          }`}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {getPlantState().charAt(0).toUpperCase() + getPlantState().slice(1)}
        </motion.div>
        <div className="text-sm text-gray-400 mt-1">
          {limitingFactor && `Limited by: ${limitingFactor.charAt(0).toUpperCase() + limitingFactor.slice(1)}`}
        </div>
      </div>
    </div>
  );
};

export default PlantVisualization;