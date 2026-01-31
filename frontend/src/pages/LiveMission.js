import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LiveMission = () => {
  const [telemetry, setTelemetry] = useState(null);
  const [risk, setRisk] = useState(null);
  const [decision, setDecision] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const fetchMissionData = async () => {
    try {
      const [telemetryRes, riskRes, decisionRes] = await Promise.all([
        axios.get(`${API}/telemetry`),
        axios.get(`${API}/risk-assessment`),
        axios.get(`${API}/decision`)
      ]);
      
      setTelemetry(telemetryRes.data);
      setRisk(riskRes.data);
      setDecision(decisionRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching mission data:', error);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMissionData();
    const interval = setInterval(fetchMissionData, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);
  
  if (loading) {
    return (
      <div className="mission-container" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '1.5rem', color: '#3b82f6' }}>Loading Mission Data...</div>
      </div>
    );
  }
  
  const getDecisionClass = (dec) => {
    if (dec?.includes('PROCEED')) return 'decision-proceed';
    if (dec?.includes('HOLD')) return 'decision-hold';
    if (dec?.includes('ABORT')) return 'decision-abort';
    return 'decision-hold';
  };
  
  const getStatusClass = (status) => {
    if (status === 'NOMINAL') return 'status-nominal';
    if (status === 'CAUTION') return 'status-caution';
    return 'status-critical';
  };
  
  return (
    <div className="mission-container" style={{ padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Mission Header */}
        <div style={{
          background: 'rgba(17, 24, 39, 0.8)',
          border: '1px solid #1f2937',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem'
        }} data-testid="mission-header">
          <div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mission ID</div>
            <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '1.125rem', fontWeight: '600' }} data-testid="mission-id">
              {telemetry?.mission_id || 'MSN-UNKNOWN'}
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mission Phase</div>
            <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '1.125rem', fontWeight: '600' }} data-testid="mission-phase">
              {telemetry?.phase || 'Unknown'}
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>System Status</div>
            <div style={{
              fontFamily: 'Orbitron, monospace',
              fontSize: '1.125rem',
              fontWeight: '600'
            }} className={getStatusClass(risk?.status)} data-testid="system-status">
              {risk?.status || 'CHECKING'}
            </div>
          </div>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          
          {/* Telemetry Panel */}
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div className="telemetry-card" data-testid="altitude-card">
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Altitude</div>
              <div className="value-display" data-testid="altitude-value">{telemetry?.altitude.toFixed(1) || '0.0'}</div>
              <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.25rem' }}>meters</div>
              <div className="progress-bar" style={{ marginTop: '1rem' }}>
                <div className="progress-fill" style={{ width: `${Math.min(100, (telemetry?.altitude || 0) / 150)}%` }} />
              </div>
            </div>
            
            <div className="telemetry-card" data-testid="velocity-card">
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Velocity</div>
              <div className="value-display" data-testid="velocity-value">{telemetry?.velocity.toFixed(1) || '0.0'}</div>
              <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.25rem' }}>m/s (descending)</div>
            </div>
            
            <div className="telemetry-card" data-testid="fuel-card">
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fuel Remaining</div>
              <div className="value-display" data-testid="fuel-value">{telemetry?.fuel.toFixed(1) || '0.0'}</div>
              <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.25rem' }}>percent</div>
              <div className="progress-bar" style={{ marginTop: '1rem' }}>
                <div className="progress-fill" style={{
                  width: `${telemetry?.fuel || 0}%`,
                  background: (telemetry?.fuel || 0) < 20 ? '#ef4444' : 'linear-gradient(90deg, #3b82f6, #06b6d4)'
                }} />
              </div>
            </div>
            
            <div className="telemetry-card" data-testid="tilt-card">
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tilt Angle</div>
              <div className="value-display" data-testid="tilt-value">{telemetry?.tilt.toFixed(2) || '0.00'}</div>
              <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.25rem' }}>degrees</div>
            </div>
            
            <div className="telemetry-card" data-testid="disturbance-card">
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Environmental Disturbance</div>
              <div className="value-display" data-testid="disturbance-value">{telemetry?.disturbance.toFixed(2) || '0.00'}</div>
              <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.25rem' }}>scale 0-1</div>
              <div className="progress-bar" style={{ marginTop: '1rem' }}>
                <div className="progress-fill" style={{
                  width: `${(telemetry?.disturbance || 0) * 100}%`,
                  background: (telemetry?.disturbance || 0) > 0.7 ? '#ef4444' : 'linear-gradient(90deg, #3b82f6, #06b6d4)'
                }} />
              </div>
            </div>
          </div>
          
          {/* Decision Panel */}
          <div>
            <div className="telemetry-card" style={{ height: '100%' }} data-testid="decision-panel">
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Decision</div>
              
              <div style={{ marginBottom: '2rem' }}>
                <div className={`decision-badge ${getDecisionClass(decision?.decision)}`} style={{ fontSize: '1rem', padding: '1rem 1.5rem' }} data-testid="current-decision">
                  {decision?.decision?.replace(/_/g, ' ') || 'EVALUATING'}
                </div>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Decision Timestamp</div>
                <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.875rem' }} data-testid="decision-timestamp">
                  {decision?.timestamp ? new Date(decision.timestamp).toLocaleString() : 'N/A'}
                </div>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Confidence Level</div>
                <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '1.5rem', fontWeight: '700' }} data-testid="decision-confidence">
                  {((decision?.confidence || 0) * 100).toFixed(1)}%
                </div>
                <div className="progress-bar" style={{ marginTop: '0.5rem' }}>
                  <div className="progress-fill" style={{ width: `${(decision?.confidence || 0) * 100}%` }} />
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Primary Reasoning</div>
                <div style={{
                  background: 'rgba(59, 130, 246, 0.05)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '4px',
                  padding: '1rem',
                  fontSize: '0.875rem',
                  lineHeight: '1.6'
                }} data-testid="decision-reasoning">
                  {decision?.reasoning?.[0] || 'Evaluating mission parameters...'}
                </div>
              </div>
            </div>
          </div>
          
        </div>
        
        {/* Risk Indicator */}
        <div className="telemetry-card" data-testid="risk-indicator">
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Overall Risk Score</div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <div className="value-display" style={{ fontSize: '4rem' }} data-testid="overall-risk-value">
              {((risk?.overall_risk || 0) * 100).toFixed(0)}
            </div>
            
            <div style={{ flex: 1, minWidth: '250px' }}>
              <div className="progress-bar" style={{ height: '32px', marginBottom: '1rem' }}>
                <div style={{
                  height: '100%',
                  width: `${(risk?.overall_risk || 0) * 100}%`,
                  background: (risk?.overall_risk || 0) < 0.3 ? '#10b981' : (risk?.overall_risk || 0) < 0.6 ? '#f59e0b' : '#ef4444',
                  transition: 'all 0.3s ease'
                }} />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9ca3af' }}>
                <span className="status-nominal">SAFE (0-30)</span>
                <span className="status-caution">CAUTION (30-60)</span>
                <span className="status-critical">CRITICAL (60-100)</span>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default LiveMission;
