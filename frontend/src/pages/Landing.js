import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();
  
  return (
    <div className="mission-container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{
            display: 'inline-block',
            padding: '0.5rem 1rem',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid #3b82f6',
            borderRadius: '4px',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            color: '#3b82f6',
            fontFamily: 'Orbitron, monospace',
            letterSpacing: '0.05em'
          }} data-testid="system-badge">
            AUTONOMOUS DECISION SYSTEM
          </div>
          
          <h1 className="hero-title" style={{ marginBottom: '1.5rem' }} data-testid="hero-title">
            Autonomous Mission Survival<br />& Decision Fabric for Spacecraft
          </h1>
          
          <p style={{
            fontSize: '1.25rem',
            color: '#9ca3af',
            maxWidth: '800px',
            margin: '0 auto 2rem',
            lineHeight: '1.6'
          }} data-testid="value-proposition">
            A system that allows spacecraft to autonomously survive, decide, and explain
            actions during mission-critical phases.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              className="btn-primary"
              onClick={() => navigate('/mission')}
              data-testid="view-live-mission-btn"
            >
              View Live Mission
            </button>
            <button 
              className="btn-secondary"
              onClick={() => navigate('/architecture')}
              data-testid="explore-architecture-btn"
            >
              Explore Architecture
            </button>
          </div>
        </div>
        
        {/* Problem Framing */}
        <div style={{
          background: 'rgba(17, 24, 39, 0.6)',
          border: '1px solid #1f2937',
          borderRadius: '8px',
          padding: '2.5rem',
          marginBottom: '3rem'
        }} data-testid="problem-framing-section">
          <h2 className="section-title">Why Autonomous Decision Systems?</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginTop: '1.5rem'
          }}>
            <div>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid #ef4444',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                fontSize: '1.5rem'
              }}>⏱</div>
              <h3 style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: '1rem',
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>Communication Delays</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem', lineHeight: '1.6' }}>
                Light-speed delays make real-time human control impossible during critical descent phases
              </p>
            </div>
            
            <div>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(245, 158, 11, 0.2)',
                border: '1px solid #f59e0b',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                fontSize: '1.5rem'
              }}>🌍</div>
              <h3 style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: '1rem',
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>Unknown Environments</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem', lineHeight: '1.6' }}>
                Unpredictable terrain and atmospheric conditions require adaptive intelligence
              </p>
            </div>
            
            <div>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid #10b981',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                fontSize: '1.5rem'
              }}>🤖</div>
              <h3 style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: '1rem',
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>Autonomous Survival</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem', lineHeight: '1.6' }}>
                Systems must self-assess, make decisions, and execute actions independently
              </p>
            </div>
          </div>
        </div>
        
        {/* System Flow */}
        <div style={{
          background: 'rgba(17, 24, 39, 0.6)',
          border: '1px solid #1f2937',
          borderRadius: '8px',
          padding: '2.5rem'
        }} data-testid="system-flow-section">
          <h2 className="section-title">Intelligent Pipeline</h2>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginTop: '1.5rem',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {[
              'Sensors',
              'Risk Assessment',
              'Decision Fabric',
              'Action Execution',
              'Explanation'
            ].map((step, index, arr) => (
              <React.Fragment key={step}>
                <div style={{
                  padding: '1rem 1.5rem',
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid #3b82f6',
                  borderRadius: '4px',
                  fontFamily: 'Orbitron, monospace',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#3b82f6',
                  textAlign: 'center'
                }} data-testid={`flow-step-${step.toLowerCase().replace(/\s+/g, '-')}`}>
                  {step}
                </div>
                {index < arr.length - 1 && (
                  <div style={{ color: '#3b82f6', fontSize: '1.5rem' }}>→</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Landing;
