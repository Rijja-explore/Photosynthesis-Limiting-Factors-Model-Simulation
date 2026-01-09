# Photosynthesis Limiting Factors Model Simulation

## Overview
This project is a 3D interactive simulation of plant growth and photosynthesis, visualizing how environmental factors affect plant health. Built with React, Three.js, and React Three Fiber, it features a realistic GLTF plant model, dynamic status indicators, and user controls for environmental scenarios.

## Features
- 3D plant visualization using GLTF model
- Real-time growth and stress simulation
- Environmental controls (light, CO₂, temperature)
- Status and growth indicators
- Zoom and rotation controls
- Responsive UI overlays

## Installation
1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd Photosynthesis-Limiting-Factors-Model-Simulation
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm start
   ```

## Usage
- Adjust environmental controls to see real-time changes in plant growth and stress.
- View status and growth indicators at the bottom of the 3D viewport.
- Zoom and rotate the plant for detailed inspection.

## Project Structure
- `src/components/` - React components for UI and 3D visualization
- `src/utils/` - Biology engine and helper functions
- `public/models/` - GLTF plant model assets
- `requirements.txt` - Python dependencies (if backend/data analysis is added)
- `package.json` - Main project dependencies

## Requirements
- Node.js (v16+ recommended)
- npm
- Modern browser (Chrome, Firefox, Edge)

## Optional Python Backend
If you add a Python backend for data analysis, list dependencies in `requirements.txt` and run with:
```bash
pip install -r requirements.txt
```

## License
MIT
