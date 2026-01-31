import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const DecisionExplanation = () => {
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchExplanation = async () => {
      try {
        const response = await axios.get(`${API}/decision-explanation`);
        setExplanation(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching explanation:', error);
        setLoading(false);
      }
    };
    
    fetchExplanation();
    const interval = setInterval(fetchExplanation, 5000);
    return () => clearInterval(interval);
  }, []);
  
  if (loading) {
    return (
      <div className="mission-container" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '1.5rem', color: '#3b82f6' }}>Loading Decision Analysis...</div>
      </div>
    );
  }
  
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
          <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }} data-testid="explanation-title">
            Decision Explanation
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '1.125rem', lineHeight: '1.6' }}>
            Complete transparency into autonomous decision-making process
          </p>
        </div>
        
        {/* Final Decision Summary */}
        <div className="telemetry-card" style={{ marginBottom: '2rem' }} data-testid="decision-summary">
          <h2 className="section-title" style={{ fontSize: '1.25rem' }}>Final Decision Summary</h2>
          
          <div style={{ display: 'grid', gap: '1.5rem', marginTop: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Decision Taken</div>
              <div className={`decision-badge ${getDecisionClass(explanation?.decision_summary?.decision)}`} data-testid="decision-taken">
                {explanation?.decision_summary?.decision?.replace(/_/g, ' ') || 'UNKNOWN'}
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Timestamp</div>
                <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.875rem' }} data-testid="decision-timestamp">
                  {explanation?.decision_summary?.timestamp ? new Date(explanation.decision_summary.timestamp).toLocaleString() : 'N/A'}
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Mission Phase</div>
                <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.875rem', fontWeight: '600' }} data-testid="decision-phase">
                  {explanation?.decision_summary?.phase || 'N/A'}
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Risk Score</div>
                <div style={{
                  fontFamily: 'Orbitron, monospace',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: (explanation?.decision_summary?.risk_score || 0) < 0.3 ? '#10b981' : (explanation?.decision_summary?.risk_score || 0) < 0.6 ? '#f59e0b' : '#ef4444'
                }} data-testid="decision-risk-score">
                  {((explanation?.decision_summary?.risk_score || 0) * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decision Timeline */}
        <div className="telemetry-card" style={{ marginBottom: '2rem' }} data-testid="decision-timeline">
          <h2 className="section-title" style={{ fontSize: '1.25rem' }}>Decision Timeline</h2>
          <div style={{ marginTop: '1.5rem' }}>
            {explanation?.timeline?.map((event, idx) => (
              <div key={idx} className="timeline-event" data-testid={`timeline-event-${idx}`}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'baseline' }}>
                  <div style={{
                    fontFamily: 'Orbitron, monospace',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#3b82f6',
                    minWidth: '60px'
                  }}>
                    {event.time}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                      {event.event}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                      {event.impact}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Rule Triggers */}
        <div className="telemetry-card" style={{ marginBottom: '2rem' }} data-testid="rule-triggers">
          <h2 className="section-title" style={{ fontSize: '1.25rem' }}>Rule Triggers & Violations</h2>
          
          {explanation?.rule_analysis?.length > 0 ? (
            <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
              {explanation.rule_analysis.map((rule, idx) => (
                <div key={idx} style={{
                  padding: '1rem',
                  background: rule.severity === 'CRITICAL' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  border: `1px solid ${rule.severity === 'CRITICAL' ? '#ef4444' : '#f59e0b'}`,
                  borderRadius: '4px'
                }} data-testid={`rule-${idx}`}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{
                      fontFamily: 'Orbitron, monospace',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: rule.severity === 'CRITICAL' ? '#ef4444' : '#f59e0b'
                    }}>
                      {rule.rule}
                    </div>
                    <div style={{
                      padding: '0.25rem 0.5rem',
                      background: rule.severity === 'CRITICAL' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {rule.severity}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#e0e6ed' }}>
                    {rule.description}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              padding: '1.5rem',
              textAlign: 'center',
              color: '#10b981',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid #10b981',
              borderRadius: '4px',
              marginTop: '1.5rem'
            }} data-testid="no-violations">
              ✓ No safety rule violations detected
            </div>
          )}
        </div>
        
        {/* ML Assessment */}
        <div className="telemetry-card" style={{ marginBottom: '2rem' }} data-testid="ml-assessment">
          <h2 className="section-title" style={{ fontSize: '1.25rem' }}>ML Risk Assessment</h2>
          
          <div style={{ display: 'grid', gap: '1.5rem', marginTop: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Risk Score</div>
                <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '1.5rem', fontWeight: '700' }} data-testid="ml-risk-score">
                  {((explanation?.ml_factors?.risk_score || 0) * 100).toFixed(1)}%
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Confidence</div>
                <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '1.5rem', fontWeight: '700' }} data-testid="ml-confidence">
                  {((explanation?.ml_factors?.confidence || 0) * 100).toFixed(1)}%
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Model Type</div>
                <div style={{ fontSize: '0.875rem', fontWeight: '500' }} data-testid="ml-model-type">
                  {explanation?.ml_factors?.model_type || 'N/A'}
                </div>
              </div>
            </div>
            
            <div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Primary Contributors</div>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {explanation?.ml_factors?.primary_contributors?.map((factor, idx) => (
                  <div key={idx} style={{
                    padding: '0.75rem',
                    background: 'rgba(59, 130, 246, 0.05)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '4px',
                    fontSize: '0.875rem'
                  }} data-testid={`ml-contributor-${idx}`}>
                    {factor}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Alternatives Considered */}
        <div className="telemetry-card" data-testid="alternatives-considered">
          <h2 className="section-title" style={{ fontSize: '1.25rem' }}>Alternatives Considered</h2>
          
          {explanation?.decision_summary?.alternatives_considered?.length > 0 ? (
            <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
              {explanation.decision_summary.alternatives_considered.map((alt, idx) => (
                <div key={idx} style={{
                  padding: '1rem',
                  background: 'rgba(107, 114, 128, 0.1)',
                  border: '1px solid #374151',
                  borderRadius: '4px'
                }} data-testid={`alternative-${idx}`}>
                  <div style={{
                    fontFamily: 'Orbitron, monospace',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                    color: '#9ca3af'
                  }}>
                    {alt.action?.replace(/_/g, ' ')}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#e0e6ed' }}>
                    <strong style={{ color: '#9ca3af' }}>Rejected:</strong> {alt.rejected_reason}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              padding: '1.5rem',
              textAlign: 'center',
              color: '#9ca3af',
              marginTop: '1.5rem'
            }}>
              No alternative actions were evaluated
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default DecisionExplanation;
