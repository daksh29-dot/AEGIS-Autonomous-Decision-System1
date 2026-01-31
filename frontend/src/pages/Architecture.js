import React, { useState } from 'react';

const Architecture = () => {
  const [expandedBlock, setExpandedBlock] = useState(null);
  
  const architectureBlocks = [
    {
      id: 'sensor',
      title: 'Sensor Layer',
      color: '#3b82f6',
      components: [
        'Altitude sensor (radar altimeter)',
        'Velocity measurement (inertial)',
        'Fuel level monitoring',
        'Tilt/orientation (gyroscope)',
        'Environmental disturbance detection',
        'System health telemetry'
      ],
      description: 'Collects real-time spacecraft state and environmental data'
    },
    {
      id: 'intelligence',
      title: 'Intelligence Layer',
      color: '#8b5cf6',
      components: [
        'ML-based risk estimation',
        'Multi-factor weighted scoring',
        'Uncertainty quantification',
        'Confidence interval calculation',
        'Sensor fusion algorithms'
      ],
      description: 'Processes sensor data to assess mission risk'
    },
    {
      id: 'decision',
      title: 'Decision Fabric',
      color: '#06b6d4',
      components: [
        'Rule-based safety constraints',
        'Threshold violation detection',
        'Hybrid ML + rule system',
        'Alternative action evaluation',
        'Priority-based decision logic'
      ],
      description: 'Makes autonomous landing decisions'
    },
    {
      id: 'execution',
      title: 'Execution Layer',
      color: '#10b981',
      components: [
        'Proceed with landing',
        'Hold and stabilize',
        'Abort mission',
        'Emergency divert (simulated)',
        'Action verification'
      ],
      description: 'Executes authorized autonomous actions'
    },
    {
      id: 'memory',
      title: 'Memory & Logging',
      color: '#f59e0b',
      components: [
        'Telemetry time-series storage',
        'Decision audit trail',
        'Explanation trace generation',
        'Mission outcome recording',
        'Replay capability'
      ],
      description: 'Maintains complete mission accountability'
    }
  ];
  
  return (
    <div className="mission-container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ marginBottom: '3rem' }}>
          <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }} data-testid="architecture-title">
            System Architecture
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '1.125rem', lineHeight: '1.6' }}>
            A layered autonomous intelligence pipeline designed for mission-critical spacecraft operations
          </p>
        </div>
        
        <div style={{
          display: 'grid',
          gap: '1.5rem'
        }}>
          {architectureBlocks.map((block) => (
            <div
              key={block.id}
              className="system-block"
              onClick={() => setExpandedBlock(expandedBlock === block.id ? null : block.id)}
              data-testid={`architecture-block-${block.id}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '2px',
                  background: block.color,
                  boxShadow: `0 0 20px ${block.color}80`
                }} />
                <h3 style={{
                  fontFamily: 'Orbitron, monospace',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  margin: 0,
                  flex: 1
                }}>
                  {block.title}
                </h3>
                <span style={{
                  color: '#9ca3af',
                  fontSize: '1.5rem',
                  transform: expandedBlock === block.id ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.2s ease'
                }}>
                  ▼
                </span>
              </div>
              
              <p style={{ color: '#9ca3af', marginBottom: '1rem' }}>
                {block.description}
              </p>
              
              {expandedBlock === block.id && (
                <div style={{
                  marginTop: '1.5rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid #374151'
                }} data-testid={`architecture-${block.id}-details`}>
                  <h4 style={{
                    fontFamily: 'Orbitron, monospace',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#9ca3af',
                    marginBottom: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Components & Responsibilities
                  </h4>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'grid',
                    gap: '0.5rem'
                  }}>
                    {block.components.map((component, idx) => (
                      <li key={idx} style={{
                        padding: '0.75rem',
                        background: 'rgba(59, 130, 246, 0.05)',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        borderRadius: '4px',
                        fontSize: '0.875rem'
                      }}>
                        • {component}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div style={{
          marginTop: '3rem',
          padding: '2rem',
          background: 'rgba(59, 130, 246, 0.05)',
          border: '1px solid #3b82f6',
          borderRadius: '8px'
        }} data-testid="architecture-note">
          <h3 style={{
            fontFamily: 'Orbitron, monospace',
            fontSize: '1rem',
            fontWeight: '600',
            marginBottom: '1rem',
            color: '#3b82f6'
          }}>
            Design Philosophy
          </h3>
          <p style={{ color: '#9ca3af', lineHeight: '1.6', margin: 0 }}>
            This architecture prioritizes <strong style={{ color: '#e0e6ed' }}>transparency</strong> and <strong style={{ color: '#e0e6ed' }}>explainability</strong> over black-box automation.
            Every decision can be traced back to specific sensor inputs, risk calculations, and rule violations.
            The hybrid approach combines deterministic safety rules with probabilistic ML assessment,
            ensuring that critical constraints are never overridden by statistical models.
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default Architecture;
