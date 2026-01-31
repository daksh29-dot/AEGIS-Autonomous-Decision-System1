import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ScenarioSimulator = () => {
  const navigate = useNavigate();
  const [params, setParams] = useState({
    disturbance: 0.3,
    fuel: 85,
    sensor_noise: 0.1,
    reaction_delay: 0
  });
  const [result, setResult] = useState(null);
  const [simulating, setSimulating] = useState(false);
  
  const handleSimulate = async () => {
    setSimulating(true);
    try {
      const response = await axios.post(`${API}/scenario-simulate`, params);
      setResult(response.data);
    } catch (error) {
      console.error('Simulation error:', error);
    }
    setSimulating(false);
  };
  
  const handleReset = async () => {
    try {
      await axios.post(`${API}/mission-reset`);
      setParams({
        disturbance: 0.3,
        fuel: 85,
        sensor_noise: 0.1,
        reaction_delay: 0
      });
      setResult(null);
    } catch (error) {
      console.error('Reset error:', error);
    }
  };
  
  const getDecisionClass = (dec) => {
    if (dec?.includes('PROCEED')) return 'decision-proceed';
    if (dec?.includes('HOLD')) return 'decision-hold';
    if (dec?.includes('ABORT')) return 'decision-abort';
    return 'decision-hold';
  };
  
  return (
    <div className="mission-container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ marginBottom: '3rem' }}>
          <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }} data-testid="simulator-title">
            Scenario Simulator
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '1.125rem', lineHeight: '1.6' }}>
            Stress-test the autonomous decision system with custom parameters
          </p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
          gap: '2rem'
        }}>
          
          {/* Control Panel */}
          <div className="telemetry-card" data-testid="control-panel">
            <h2 className="section-title" style={{ fontSize: '1.25rem' }}>User Controls</h2>
            
            <div style={{ display: 'grid', gap: '2rem', marginTop: '1.5rem' }}>
              
              {/* Environmental Disturbance */}
              <div data-testid="disturbance-control">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#e0e6ed'
                  }}>
                    Environmental Disturbance
                  </label>
                  <span style={{
                    fontFamily: 'Orbitron, monospace',
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    color: '#3b82f6'
                  }} data-testid="disturbance-value">
                    {params.disturbance.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={params.disturbance}
                  onChange={(e) => setParams({...params, disturbance: parseFloat(e.target.value)})}
                  className="slider-input"
                  data-testid="disturbance-slider"
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                  <span>Calm (0.0)</span>
                  <span>Extreme (1.0)</span>
                </div>
              </div>
              
              {/* Fuel Level */}
              <div data-testid="fuel-control">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#e0e6ed'
                  }}>
                    Fuel Remaining
                  </label>
                  <span style={{
                    fontFamily: 'Orbitron, monospace',
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    color: '#3b82f6'
                  }} data-testid="fuel-control-value">
                    {params.fuel.toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={params.fuel}
                  onChange={(e) => setParams({...params, fuel: parseFloat(e.target.value)})}
                  className="slider-input"
                  data-testid="fuel-slider"
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                  <span>Empty (0%)</span>
                  <span>Full (100%)</span>
                </div>
              </div>
              
              {/* Sensor Noise */}
              <div data-testid="noise-control">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#e0e6ed'
                  }}>
                    Sensor Noise
                  </label>
                  <span style={{
                    fontFamily: 'Orbitron, monospace',
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    color: '#3b82f6'
                  }} data-testid="noise-value">
                    {params.sensor_noise.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.5"
                  step="0.05"
                  value={params.sensor_noise}
                  onChange={(e) => setParams({...params, sensor_noise: parseFloat(e.target.value)})}
                  className="slider-input"
                  data-testid="noise-slider"
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                  <span>Clean (0.0)</span>
                  <span>Noisy (0.5)</span>
                </div>
              </div>
              
              {/* Reaction Delay */}
              <div data-testid="delay-control">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#e0e6ed'
                  }}>
                    Reaction Delay (simulated)
                  </label>
                  <span style={{
                    fontFamily: 'Orbitron, monospace',
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    color: '#3b82f6'
                  }} data-testid="delay-value">
                    {params.reaction_delay}ms
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="50"
                  value={params.reaction_delay}
                  onChange={(e) => setParams({...params, reaction_delay: parseInt(e.target.value)})}
                  className="slider-input"
                  data-testid="delay-slider"
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                  <span>Instant (0ms)</span>
                  <span>Delayed (500ms)</span>
                </div>
              </div>
              
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button
                className="btn-primary"
                onClick={handleSimulate}
                disabled={simulating}
                style={{ flex: 1 }}
                data-testid="simulate-btn"
              >
                {simulating ? 'Simulating...' : 'Run Simulation'}
              </button>
              <button
                className="btn-secondary"
                onClick={handleReset}
                data-testid="reset-btn"
              >
                Reset
              </button>
            </div>
          </div>
          
          {/* Results Panel */}
          <div className="telemetry-card" data-testid="results-panel">
            <h2 className="section-title" style={{ fontSize: '1.25rem' }}>System Response</h2>
            
            {result ? (
              <div style={{ display: 'grid', gap: '1.5rem', marginTop: '1.5rem' }}>
                
                {/* Decision */}
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Decision</div>
                  <div className={`decision-badge ${getDecisionClass(result.decision?.decision)}`} style={{ fontSize: '1rem', padding: '0.75rem 1.25rem' }} data-testid="result-decision">
                    {result.decision?.decision?.replace(/_/g, ' ') || 'EVALUATING'}
                  </div>
                </div>
                
                {/* Risk Score */}
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Updated Risk Score</div>
                  <div style={{
                    fontFamily: 'Orbitron, monospace',
                    fontSize: '3rem',
                    fontWeight: '700',
                    color: (result.risk_assessment?.overall_risk || 0) < 0.3 ? '#10b981' : (result.risk_assessment?.overall_risk || 0) < 0.6 ? '#f59e0b' : '#ef4444'
                  }} data-testid="result-risk-score">
                    {((result.risk_assessment?.overall_risk || 0) * 100).toFixed(0)}%
                  </div>
                  <div className="progress-bar" style={{ marginTop: '1rem', height: '12px' }}>
                    <div style={{
                      height: '100%',
                      width: `${(result.risk_assessment?.overall_risk || 0) * 100}%`,
                      background: (result.risk_assessment?.overall_risk || 0) < 0.3 ? '#10b981' : (result.risk_assessment?.overall_risk || 0) < 0.6 ? '#f59e0b' : '#ef4444',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
                
                {/* Telemetry */}
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Updated Telemetry</div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '0.75rem',
                    fontSize: '0.875rem'
                  }}>
                    <div style={{
                      padding: '0.75rem',
                      background: 'rgba(59, 130, 246, 0.05)',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      borderRadius: '4px'
                    }} data-testid="result-altitude">
                      <div style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Altitude</div>
                      <div style={{ fontFamily: 'Orbitron, monospace', fontWeight: '600' }}>{result.telemetry?.altitude?.toFixed(1) || '0.0'}m</div>
                    </div>
                    
                    <div style={{
                      padding: '0.75rem',
                      background: 'rgba(59, 130, 246, 0.05)',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      borderRadius: '4px'
                    }} data-testid="result-fuel">
                      <div style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Fuel</div>
                      <div style={{ fontFamily: 'Orbitron, monospace', fontWeight: '600' }}>{result.telemetry?.fuel?.toFixed(1) || '0.0'}%</div>
                    </div>
                    
                    <div style={{
                      padding: '0.75rem',
                      background: 'rgba(59, 130, 246, 0.05)',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      borderRadius: '4px'
                    }} data-testid="result-tilt">
                      <div style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Tilt</div>
                      <div style={{ fontFamily: 'Orbitron, monospace', fontWeight: '600' }}>{result.telemetry?.tilt?.toFixed(2) || '0.00'}°</div>
                    </div>
                    
                    <div style={{
                      padding: '0.75rem',
                      background: 'rgba(59, 130, 246, 0.05)',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      borderRadius: '4px'
                    }} data-testid="result-disturbance">
                      <div style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Disturbance</div>
                      <div style={{ fontFamily: 'Orbitron, monospace', fontWeight: '600' }}>{result.telemetry?.disturbance?.toFixed(2) || '0.00'}</div>
                    </div>
                  </div>
                </div>
                
                {/* Link to Explanation */}
                <button
                  className="btn-secondary"
                  onClick={() => navigate('/decision')}
                  style={{ width: '100%' }}
                  data-testid="view-explanation-btn"
                >
                  View Detailed Explanation
                </button>
                
              </div>
            ) : (
              <div style={{
                padding: '3rem 1rem',
                textAlign: 'center',
                color: '#9ca3af',
                border: '2px dashed #374151',
                borderRadius: '8px',
                marginTop: '1.5rem'
              }} data-testid="no-results">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚙️</div>
                <p>Adjust parameters and run simulation to see results</p>
              </div>
            )}
          </div>
          
        </div>
        
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid #f59e0b',
          borderRadius: '8px'
        }} data-testid="simulator-note">
          <h3 style={{
            fontFamily: 'Orbitron, monospace',
            fontSize: '0.875rem',
            fontWeight: '600',
            marginBottom: '0.75rem',
            color: '#f59e0b'
          }}>
            STRESS TESTING CAPABILITY
          </h3>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: '#e0e6ed', margin: 0 }}>
            This simulator allows you to intentionally push the system into failure modes.
            Try extreme combinations like high disturbance + low fuel to observe how the decision fabric responds.
            All decisions remain explainable and traceable regardless of conditions.
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default ScenarioSimulator;
