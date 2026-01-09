import React, { useState } from 'react';
import './App.css';
import LandingPage from './components/LandingPage';
import Simulator from './components/Simulator';

function App() {
  const [currentView, setCurrentView] = useState('landing');

  const handleStartSimulator = () => {
    setCurrentView('simulator');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  return (
    <div className="App">
      {currentView === 'landing' ? (
        <LandingPage onStart={handleStartSimulator} />
      ) : (
        <Simulator onBack={handleBackToLanding} />
      )}
    </div>
  );
}

export default App;
