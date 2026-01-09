# 🌱 Photosynthesis Simulation

An interactive React-based photosynthesis simulation that demonstrates the effects of environmental factors on plant health and growth. Features real-time 3D visualization, dynamic time-lapse projections, and scientific modeling based on Blackman's Law of Limiting Factors.

## ✨ Features

- **🎛️ Interactive Environmental Controls**: Adjust light intensity, CO₂ concentration, and temperature with percentage-based sliders
- **🌿 3D Plant Visualization**: Real-time GLTF plant model that responds to environmental changes
- **📊 Dynamic Time-Lapse**: 30-day projections that update instantly when conditions change
- **🧠 AI Recommendations**: Intelligent suggestions for optimizing plant growth
- **📈 Real-Time Graphs**: Live photosynthesis rate and environmental data visualization
- **🔬 Scientific Accuracy**: Implementation of Blackman's Law of Limiting Factors

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Photosynthesis-Simulation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 How to Use

### 🌡️ Environmental Controls
- **Light Intensity**: 0-100% (0-1000 μmol/m²/s)
- **CO₂ Concentration**: 0-100% (100-1000 ppm)
- **Temperature**: 0-100% (0-45°C)

### 📊 Real-Time Features
- **3D Plant Model**: Watch the plant respond to environmental changes
- **Photosynthesis Rate Graph**: Live updates showing current efficiency
- **Time-Lapse Simulation**: 30-day projections with play/pause controls
- **AI Recommendations**: Get suggestions for optimal growing conditions

### 🎯 Scenario Presets
- **Climate Change 2050**: Simulates future climate conditions
- **Drought Conditions**: Low water availability scenarios
- **Greenhouse Optimal**: Perfect controlled environment

## 🔬 Scientific Foundation

### Blackman's Law of Limiting Factors
The simulation implements the principle that photosynthesis rate is limited by the factor in shortest supply:
- Light intensity affects energy availability
- CO₂ concentration affects carbon fixation
- Temperature affects enzyme activity

### Formula Implementation
```javascript
Rate = min(lightFactor, co2Factor, temperatureFactor) × maxRate
```

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── EnvironmentalControls.js    # Slider controls
│   ├── PlantVisualization3D.js     # 3D plant display
│   ├── TimeLapse.js                # Time-lapse simulation
│   ├── Graph.jsx                   # Data visualization
│   └── ...
├── logic/              # Backend logic (separated)
│   ├── photosynthesisModel.js      # Core calculations
│   ├── recommendationEngine.js     # AI suggestions
│   └── timeLapseSimulation.js      # Long-term modeling
└── utils/              # Helper functions
    ├── biologyEngine.js            # Scientific calculations
    └── photosynthesisLogic.js      # Main logic adapter
```

## 🛠️ Technologies

- **React 19.2.3**: Component-based UI framework
- **Framer Motion**: Smooth animations and transitions
- **Three.js**: 3D plant visualization
- **Recharts**: Interactive data visualization
- **Tailwind CSS**: Utility-first styling

## 📱 Build & Deploy

### Development
```bash
npm start          # Start development server
npm test           # Run tests
```

### Production
```bash
npm run build      # Create production build
npm run serve      # Serve production build locally
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Roadmap

- [ ] Additional plant species models
- [ ] Weather pattern integration
- [ ] Seasonal variation simulations
- [ ] Export/import simulation data
- [ ] Multi-plant ecosystem modeling

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Scientific modeling based on plant biology research
- 3D models and animations created with Three.js
- Built with Create React App for rapid development

---

**Made with 🌱 for science education and environmental awareness**
