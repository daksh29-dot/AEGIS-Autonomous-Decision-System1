import React from 'react';

const TechnicalNotes = () => {
  return (
    <div className="mission-container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <div style={{ marginBottom: '3rem' }}>
          <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }} data-testid="technical-title">
            Technical Notes
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '1.125rem', lineHeight: '1.6' }}>
            Engineering transparency, limitations, and design philosophy
          </p>
        </div>
        
        {/* Assumptions */}
        <div className="telemetry-card" style={{ marginBottom: '2rem' }} data-testid="assumptions-section">
          <h2 className="section-title" style={{ fontSize: '1.25rem' }}>System Assumptions</h2>
          
          <div style={{ marginTop: '1.5rem' }}>
            <ul style={{ fontSize: '0.875rem', lineHeight: '1.8', color: '#e0e6ed', paddingLeft: '1.5rem', margin: 0 }}>
              <li>
                <strong>Sensor Reliability:</strong> All sensors are assumed to provide accurate real-time data within specified tolerances. System health monitoring provides basic fault detection.
              </li>
              <li style={{ marginTop: '0.75rem' }}>
                <strong>Physics Simulation:</strong> Descent physics are simplified for demonstration. Real spacecraft dynamics include atmospheric drag, thrust vectoring, and complex multi-body interactions.
              </li>
              <li style={{ marginTop: '0.75rem' }}>
                <strong>Communication:</strong> This system operates under the assumption of no communication delays for internal processing. In real missions, command latency would be factored into decision timing.
              </li>
              <li style={{ marginTop: '0.75rem' }}>
                <strong>Terrain Awareness:</strong> Current implementation does not include terrain mapping or surface hazard detection. Landing site is assumed to be pre-validated.
              </li>
              <li style={{ marginTop: '0.75rem' }}>
                <strong>Power Systems:</strong> System health is abstracted. Real implementations would need detailed power budget monitoring and thermal management.
              </li>
            </ul>
          </div>
        </div>
        
        {/* Known Limitations */}
        <div className="telemetry-card" style={{ marginBottom: '2rem' }} data-testid="limitations-section">
          <h2 className="section-title" style={{ fontSize: '1.25rem' }}>Known Limitations</h2>
          
          <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
            <div style={{
              padding: '1rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #ef4444',
              borderRadius: '4px'
            }}>
              <div style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#ef4444',
                marginBottom: '0.5rem'
              }}>
                Simplified Risk Model
              </div>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.6', margin: 0 }}>
                The ML risk assessment uses weighted scoring rather than deep learning models. 
                Real spacecraft would benefit from neural networks trained on extensive mission data.
              </p>
            </div>
            
            <div style={{
              padding: '1rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #ef4444',
              borderRadius: '4px'
            }}>
              <div style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#ef4444',
                marginBottom: '0.5rem'
              }}>
                No Multi-Agent Coordination
              </div>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.6', margin: 0 }}>
                This system models a single autonomous spacecraft. Future versions should support 
                multi-spacecraft coordination for landing site selection and resource sharing.
              </p>
            </div>
            
            <div style={{
              padding: '1rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #ef4444',
              borderRadius: '4px'
            }}>
              <div style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#ef4444',
                marginBottom: '0.5rem'
              }}>
                Deterministic Environment
              </div>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.6', margin: 0 }}>
                Environmental disturbance is modeled as a single scalar value. Real missions face 
                multi-dimensional environmental challenges including wind shear, dust storms, and radiation.
              </p>
            </div>
            
            <div style={{
              padding: '1rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #ef4444',
              borderRadius: '4px'
            }}>
              <div style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#ef4444',
                marginBottom: '0.5rem'
              }}>
                Limited Abort Options
              </div>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.6', margin: 0 }}>
                Abort and divert scenarios are conceptual. Production systems would require detailed 
                trajectory planning, alternative landing site databases, and orbital mechanics calculations.
              </p>
            </div>
          </div>
        </div>
        
        {/* Safety Philosophy */}
        <div className="telemetry-card" style={{ marginBottom: '2rem' }} data-testid="safety-section">
          <h2 className="section-title" style={{ fontSize: '1.25rem' }}>Safety Philosophy</h2>
          
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{
              padding: '1.5rem',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid #10b981',
              borderRadius: '4px',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#10b981',
                marginBottom: '0.75rem'
              }}>
                HYBRID DECISION ARCHITECTURE
              </h3>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.6', margin: 0 }}>
                This system implements a <strong style={{ color: '#e0e6ed' }}>hybrid approach</strong> where 
                deterministic safety rules can override ML-based risk assessments. Critical constraints 
                (fuel thresholds, tilt limits, system health) are hard-coded and never bypassed by 
                probabilistic models.
              </p>
            </div>
            
            <div style={{
              padding: '1.5rem',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid #10b981',
              borderRadius: '4px',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#10b981',
                marginBottom: '0.75rem'
              }}>
                EXPLAINABILITY FIRST
              </h3>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.6', margin: 0 }}>
                Every decision generates a complete explanation trace. No "black box" AI decisions. 
                Engineers can audit exactly which sensors, rules, and risk factors contributed to each action.
              </p>
            </div>
            
            <div style={{
              padding: '1.5rem',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid #10b981',
              borderRadius: '4px'
            }}>
              <h3 style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#10b981',
                marginBottom: '0.75rem'
              }}>
                CONSERVATIVE DEFAULTS
              </h3>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.6', margin: 0 }}>
                When faced with uncertainty or ambiguous sensor data, the system defaults to 
                conservative actions (hold pattern or abort) rather than proceeding with landing.
              </p>
            </div>
          </div>
        </div>
        
        {/* Future Improvements */}
        <div className="telemetry-card" data-testid="improvements-section">
          <h2 className="section-title" style={{ fontSize: '1.25rem' }}>Future Improvements</h2>
          
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'grid', gap: '1rem' }}>
              
              <div style={{
                padding: '1rem',
                background: 'rgba(59, 130, 246, 0.05)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '4px'
              }}>
                <div style={{
                  fontFamily: 'Orbitron, monospace',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#3b82f6',
                  marginBottom: '0.5rem'
                }}>
                  1. Terrain-Relative Navigation
                </div>
                <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: '#e0e6ed', margin: 0 }}>
                  Integrate LIDAR/camera-based terrain mapping for real-time hazard detection and 
                  landing site selection within a designated area.
                </p>
              </div>
              
              <div style={{
                padding: '1rem',
                background: 'rgba(59, 130, 246, 0.05)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '4px'
              }}>
                <div style={{
                  fontFamily: 'Orbitron, monospace',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#3b82f6',
                  marginBottom: '0.5rem'
                }}>
                  2. Deep Learning Risk Models
                </div>
                <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: '#e0e6ed', margin: 0 }}>
                  Train neural networks on historical mission data to improve risk prediction accuracy 
                  and handle complex multi-factor interactions.
                </p>
              </div>
              
              <div style={{
                padding: '1rem',
                background: 'rgba(59, 130, 246, 0.05)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '4px'
              }}>
                <div style={{
                  fontFamily: 'Orbitron, monospace',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#3b82f6',
                  marginBottom: '0.5rem'
                }}>
                  3. Multi-Spacecraft Coordination
                </div>
                <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: '#e0e6ed', margin: 0 }}>
                  Implement distributed decision systems where multiple autonomous spacecraft can 
                  share sensor data and coordinate landing sequences.
                </p>
              </div>
              
              <div style={{
                padding: '1rem',
                background: 'rgba(59, 130, 246, 0.05)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '4px'
              }}>
                <div style={{
                  fontFamily: 'Orbitron, monospace',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#3b82f6',
                  marginBottom: '0.5rem'
                }}>
                  4. Formal Verification
                </div>
                <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: '#e0e6ed', margin: 0 }}>
                  Apply formal methods to mathematically prove safety properties of the decision fabric 
                  under all possible operating conditions.
                </p>
              </div>
              
              <div style={{
                padding: '1rem',
                background: 'rgba(59, 130, 246, 0.05)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '4px'
              }}>
                <div style={{
                  fontFamily: 'Orbitron, monospace',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#3b82f6',
                  marginBottom: '0.5rem'
                }}>
                  5. Hardware-in-the-Loop Testing
                </div>
                <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: '#e0e6ed', margin: 0 }}>
                  Integrate with spacecraft simulators and actual flight hardware for comprehensive 
                  validation before operational deployment.
                </p>
              </div>
              
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default TechnicalNotes;
