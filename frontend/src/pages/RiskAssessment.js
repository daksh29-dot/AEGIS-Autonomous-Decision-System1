import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const RiskAssessment = () => {
  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchRisk = async () => {
      try {
        const response = await axios.get(`${API}/risk-assessment`);
        setRisk(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching risk:', error);
        setLoading(false);
      }
    };
    
    fetchRisk();
    const interval = setInterval(fetchRisk, 5000);
    return () => clearInterval(interval);
  }, []);
  
  if (loading) {
    return (
      <div className="mission-container" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '1.5rem', color: '#3b82f6' }}>Loading Risk Assessment...</div>
      </div>
    );
  }
  
  const riskComponents = [
    { key: 'fuel_risk', label: 'Fuel Risk', description: 'Risk from low fuel reserves', color: '#ef4444' },
    { key: 'stability_risk', label: 'Stability Risk', description: 'Risk from tilt and orientation', color: '#f59e0b' },
    { key: 'environmental_risk', label: 'Environmental Risk', description: 'Risk from external disturbances', color: '#8b5cf6' },
    { key: 'system_health_risk', label: 'System Health Risk', description: 'Risk from degraded systems', color: '#06b6d4' }
  ];
  
  const getStatusClass = (status) => {
    if (status === 'NOMINAL') return 'status-nominal';
    if (status === 'CAUTION') return 'status-caution';
    return 'status-critical';
  };
  
  return (
    <div className="mission-container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ marginBottom: '3rem' }}>
          <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }} data-testid="risk-title">
            Risk Assessment
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '1.125rem', lineHeight: '1.6' }}>
            Multi-factor risk analysis with transparent scoring methodology
          </p>
        </div>
        
        {/* Overall Risk Score */}
        <div className="telemetry-card" style={{ marginBottom: '2rem' }} data-testid="overall-risk-section">
          <h2 className="section-title" style={{ fontSize: '1.25rem' }}>Overall Risk Score</h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
            <div>
              <div className="value-display" style={{
                fontSize: '5rem',
                color: (risk?.overall_risk || 0) < 0.3 ? '#10b981' : (risk?.overall_risk || 0) < 0.6 ? '#f59e0b' : '#ef4444'
              }} data-testid="overall-risk-value">
                {((risk?.overall_risk || 0) * 100).toFixed(0)}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#9ca3af', textAlign: 'center' }}>out of 100</div>
            </div>
            
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div className="progress-bar" style={{ height: '40px', marginBottom: '1rem' }}>
                <div style={{
                  height: '100%',
                  width: `${(risk?.overall_risk || 0) * 100}%`,
                  background: (risk?.overall_risk || 0) < 0.3 ? '#10b981' : (risk?.overall_risk || 0) < 0.6 ? '#f59e0b' : '#ef4444',
                  transition: 'width 0.5s ease'
                }} />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '1.5rem' }}>
                <span className="status-nominal">SAFE</span>
                <span className="status-caution">CAUTION</span>
                <span className="status-critical">CRITICAL</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Status</div>
                  <div style={{
                    fontFamily: 'Orbitron, monospace',
                    fontSize: '1rem',
                    fontWeight: '700'
                  }} className={getStatusClass(risk?.status)} data-testid="risk-status">
                    {risk?.status || 'UNKNOWN'}
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Confidence</div>
                  <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '1rem', fontWeight: '700' }} data-testid="risk-confidence">
                    {((risk?.confidence || 0) * 100).toFixed(1)}%
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Urgency Factor</div>
                  <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '1rem', fontWeight: '700' }} data-testid="risk-urgency">
                    {risk?.urgency_factor?.toFixed(2) || '1.00'}x
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Risk Components */}
        <div className="telemetry-card" style={{ marginBottom: '2rem' }} data-testid="risk-components-section">
          <h2 className="section-title" style={{ fontSize: '1.25rem' }}>Risk Components</h2>
          
          <div style={{ display: 'grid', gap: '1.5rem', marginTop: '1.5rem' }}>
            {riskComponents.map((component) => {
              const value = risk?.components?.[component.key] || 0;
              return (
                <div key={component.key} style={{
                  padding: '1.5rem',
                  background: 'rgba(17, 24, 39, 0.4)',
                  border: '1px solid #374151',
                  borderRadius: '4px'
                }} data-testid={`risk-component-${component.key}`}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{
                        fontFamily: 'Orbitron, monospace',
                        fontSize: '1rem',
                        fontWeight: '600',
                        marginBottom: '0.25rem'
                      }}>
                        {component.label}
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: '#9ca3af', margin: 0 }}>
                        {component.description}
                      </p>
                    </div>
                    <div style={{
                      fontFamily: 'Orbitron, monospace',
                      fontSize: '2rem',
                      fontWeight: '700',
                      color: component.color
                    }} data-testid={`${component.key}-value`}>
                      {(value * 100).toFixed(0)}
                    </div>
                  </div>
                  
                  <div className="progress-bar" style={{ height: '12px' }}>
                    <div style={{
                      height: '100%',
                      width: `${value * 100}%`,
                      background: component.color,
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Threshold Explanation */}
        <div className="telemetry-card" data-testid="threshold-explanation">
          <h2 className="section-title" style={{ fontSize: '1.25rem' }}>Risk Thresholds & Methodology</h2>
          
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{
              padding: '1rem',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid #10b981',
              borderRadius: '4px',
              marginBottom: '1rem'
            }}>
              <div style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#10b981',
                marginBottom: '0.5rem'
              }}>
                NOMINAL (0-30)
              </div>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>
                All systems operating within safe parameters. Landing can proceed with standard protocols.
              </p>
            </div>
            
            <div style={{
              padding: '1rem',
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid #f59e0b',
              borderRadius: '4px',
              marginBottom: '1rem'
            }}>
              <div style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#f59e0b',
                marginBottom: '0.5rem'
              }}>
                CAUTION (30-60)
              </div>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>
                Elevated risk detected. System may enter hold pattern for stabilization before proceeding.
              </p>
            </div>
            
            <div style={{
              padding: '1rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #ef4444',
              borderRadius: '4px',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#ef4444',
                marginBottom: '0.5rem'
              }}>
                CRITICAL (60-100)
              </div>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>
                Multiple safety violations or extreme conditions detected. Abort protocols may be triggered.
              </p>
            </div>
            
            <div style={{
              padding: '1.5rem',
              background: 'rgba(59, 130, 246, 0.05)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '4px'
            }}>
              <h3 style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: '0.875rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#3b82f6'
              }}>
                SCORING METHODOLOGY
              </h3>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: '#e0e6ed' }}>
                Overall risk is calculated using a <strong>weighted multi-factor model</strong>:
              </p>
              <ul style={{ fontSize: '0.875rem', lineHeight: '1.8', color: '#e0e6ed', marginTop: '0.75rem' }}>
                <li>Stability Risk: 35% weight (tilt angle assessment)</li>
                <li>Fuel Risk: 25% weight (remaining fuel percentage)</li>
                <li>Environmental Risk: 20% weight (disturbance levels)</li>
                <li>System Health Risk: 20% weight (component status)</li>
              </ul>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: '#e0e6ed', marginTop: '0.75rem' }}>
                An <strong>urgency multiplier</strong> (1.0-1.5x) is applied based on altitude to reflect increasing risk during final descent phases.
              </p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default RiskAssessment;
