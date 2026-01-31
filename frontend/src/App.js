import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "@/App.css";

import Navigation from './components/Navigation';
import Landing from './pages/Landing';
import Architecture from './pages/Architecture';
import LiveMission from './pages/LiveMission';
import DecisionExplanation from './pages/DecisionExplanation';
import RiskAssessment from './pages/RiskAssessment';
import ScenarioSimulator from './pages/ScenarioSimulator';
import MissionLogs from './pages/MissionLogs';
import TechnicalNotes from './pages/TechnicalNotes';

function App() {
  return (
    <div className="App" style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0a0e1a 0%, #111827 100%)' }}>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/architecture" element={<Architecture />} />
          <Route path="/mission" element={<LiveMission />} />
          <Route path="/decision" element={<DecisionExplanation />} />
          <Route path="/risk" element={<RiskAssessment />} />
          <Route path="/simulator" element={<ScenarioSimulator />} />
          <Route path="/logs" element={<MissionLogs />} />
          <Route path="/technical" element={<TechnicalNotes />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
