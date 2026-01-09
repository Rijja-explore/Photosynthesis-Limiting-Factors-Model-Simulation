import React from 'react';
import { motion } from 'framer-motion';

const LandingPage = ({ onStart }) => {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <div className="flex h-full relative">
        {/* Thriving Side */}
        <motion.div 
          className="flex-1 flex flex-col justify-center items-center relative bg-gradient-to-br from-green-600 via-green-500 to-green-400"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="relative w-80 h-96 flex justify-center items-end">
            <motion.div 
              className="relative w-24 h-72"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Thriving Plant SVG */}
              <svg width="100%" height="100%" viewBox="0 0 100 300" className="drop-shadow-lg">
                {/* Stem */}
                <rect x="45" y="150" width="10" height="150" fill="#166534" rx="5"/>
                {/* Leaves */}
                <motion.ellipse cx="25" cy="120" rx="20" ry="8" fill="#22c55e" transform="rotate(-30 25 120)"
                  animate={{ rx: [20, 22, 20], ry: [8, 9, 8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.ellipse cx="75" cy="120" rx="20" ry="8" fill="#22c55e" transform="rotate(30 75 120)"
                  animate={{ rx: [20, 22, 20], ry: [8, 9, 8] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                <motion.ellipse cx="20" cy="140" rx="22" ry="9" fill="#16a34a" transform="rotate(-45 20 140)"
                  animate={{ rx: [22, 24, 22], ry: [9, 10, 9] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
                <motion.ellipse cx="80" cy="140" rx="22" ry="9" fill="#16a34a" transform="rotate(45 80 140)"
                  animate={{ rx: [22, 24, 22], ry: [9, 10, 9] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
                />
              </svg>
            </motion.div>
            
            {/* Environment effects */}
            <motion.div 
              className="absolute top-8 left-8 w-16 h-16 bg-yellow-300 rounded-full opacity-80"
              animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <motion.h2 
            className="text-2xl font-bold text-white mt-8 text-shadow-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Thriving Rainforest
          </motion.h2>
        </motion.div>

        {/* Stressed Side */}
        <motion.div 
          className="flex-1 flex flex-col justify-center items-center relative bg-gradient-to-br from-orange-600 via-yellow-600 to-red-500"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div className="relative w-80 h-96 flex justify-center items-end">
            <motion.div 
              className="relative w-24 h-72"
              animate={{ x: [0, 1, -1, 0], rotate: [0, 0.5, -0.5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {/* Stressed Plant SVG */}
              <svg width="100%" height="100%" viewBox="0 0 100 300" className="drop-shadow-lg">
                {/* Withered Stem */}
                <rect x="47" y="180" width="6" height="120" fill="#991b1b" rx="3"/>
                {/* Wilted Leaves */}
                <ellipse cx="30" cy="160" rx="15" ry="6" fill="#dc2626" transform="rotate(-40 30 160)"/>
                <ellipse cx="70" cy="160" rx="15" ry="6" fill="#dc2626" transform="rotate(40 70 160)"/>
                <ellipse cx="25" cy="180" rx="12" ry="5" fill="#b91c1c" transform="rotate(-50 25 180)"/>
              </svg>
            </motion.div>
            
            {/* Heat waves */}
            <motion.div 
              className="absolute top-12 right-12 w-12 h-12 bg-red-400 rounded-full opacity-70"
              animate={{ scale: [1, 1.3, 1], skewX: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </div>
          <motion.h2 
            className="text-2xl font-bold text-white mt-8 text-shadow-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Desert Survival
          </motion.h2>
        </motion.div>
      </div>

      {/* Central Question */}
      <motion.div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white z-10 bg-black bg-opacity-60 backdrop-blur-md p-12 rounded-3xl border border-white border-opacity-20"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <motion.h1 
          className="text-5xl font-bold mb-6 bg-gradient-to-r from-white via-green-200 to-white bg-clip-text text-transparent"
          animate={{ opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          What Made the Difference?
        </motion.h1>
        <p className="text-xl text-gray-200 mb-8 max-w-md mx-auto leading-relaxed">
          Discover the hidden intelligence behind plant survival
        </p>
        <motion.button 
          className="relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-bold text-xl px-12 py-6 rounded-full shadow-2xl transition-all duration-300 overflow-hidden"
          onClick={onStart}
          whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(34, 197, 94, 0.4)" }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            className="absolute inset-0 bg-white opacity-0 rounded-full"
            whileHover={{ opacity: [0, 0.1, 0] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
          <span className="relative z-10">Discover Why</span>
          
          {/* Pulse ring */}
          <motion.div
            className="absolute inset-0 border-2 border-green-300 rounded-full"
            animate={{ scale: [1, 1.3], opacity: [0.8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default LandingPage;