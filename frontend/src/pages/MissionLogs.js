import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const MissionLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(`${API}/mission-logs`);
        setLogs(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching logs:', error);
        setLoading(false);
      }
    };
    
    fetchLogs();
  }, []);
  
  // Generate sample logs if none exist
  const sampleLogs = logs.length > 0 ? logs : [
    {
      id: '1',
      mission_id: 'MSN-ALPHA-001',
      outcome: 'SUCCESSFUL_LANDING',
      max_risk: 0.28,
      decision_count: 15,
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
      final_altitude: 0,
      final_fuel: 45.2
    },
    {
      id: '2',
      mission_id: 'MSN-ALPHA-002',
      outcome: 'ABORT_EXECUTED',
      max_risk: 0.85,
      decision_count: 22,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      final_altitude: 1250,
      final_fuel: 12.5
    },
    {
      id: '3',
      mission_id: 'MSN-ALPHA-003',
      outcome: 'SUCCESSFUL_LANDING',
      max_risk: 0.42,
      decision_count: 18,
      timestamp: new Date(Date.now() - 43200000).toISOString(),
      final_altitude: 0,
      final_fuel: 38.7
    },
    {
      id: '4',
      mission_id: 'MSN-ALPHA-004',
      outcome: 'HOLD_STABILIZED',
      max_risk: 0.55,
      decision_count: 28,
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      final_altitude: 850,
      final_fuel: 52.3
    }
  ];
  
  const displayLogs = logs.length > 0 ? logs : sampleLogs;
  
  const getOutcomeColor = (outcome) => {
    if (outcome?.includes('SUCCESS')) return '#10b981';
    if (outcome?.includes('ABORT')) return '#ef4444';
    return '#f59e0b';
  };
  
  return (
    <div className="mission-container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        <div style={{ marginBottom: '3rem' }}>
          <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }} data-testid="logs-title">
            Mission Logs & Data Vault
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '1.125rem', lineHeight: '1.6' }}>
            Complete audit trail of autonomous mission operations
          </p>
        </div>
        
        <div style={{
          padding: '1.5rem',
          background: 'rgba(59, 130, 246, 0.05)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '8px',
          marginBottom: '2rem'
        }} data-testid="logs-info">
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: '2rem',
                fontWeight: '700',
                color: '#3b82f6'
              }} data-testid="total-missions">
                {displayLogs.length}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Missions</div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: '2rem',
                fontWeight: '700',
                color: '#10b981'
              }} data-testid="successful-missions">
                {displayLogs.filter(l => l.outcome?.includes('SUCCESS')).length}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Successful</div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: '2rem',
                fontWeight: '700',
                color: '#ef4444'
              }} data-testid="aborted-missions">
                {displayLogs.filter(l => l.outcome?.includes('ABORT')).length}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Aborted</div>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#3b82f6', fontSize: '1.25rem' }}>
            Loading mission logs...
          </div>
        ) : (
          <div className="table-container" data-testid="mission-logs-table">
            <table>
              <thead>
                <tr>
                  <th>Mission ID</th>
                  <th>Outcome</th>
                  <th>Max Risk</th>
                  <th>Decisions</th>
                  <th>Final Altitude</th>
                  <th>Final Fuel</th>
                  <th>Timestamp</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayLogs.map((log) => (
                  <tr key={log.id} data-testid={`mission-log-${log.id}`}>
                    <td>
                      <div style={{
                        fontFamily: 'Orbitron, monospace',
                        fontWeight: '600',
                        fontSize: '0.875rem'
                      }}>
                        {log.mission_id}
                      </div>
                    </td>
                    <td>
                      <div style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        background: `${getOutcomeColor(log.outcome)}20`,
                        border: `1px solid ${getOutcomeColor(log.outcome)}`,
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: getOutcomeColor(log.outcome)
                      }}>
                        {log.outcome.replace(/_/g, ' ')}
                      </div>
                    </td>
                    <td>
                      <div style={{
                        fontFamily: 'Orbitron, monospace',
                        fontWeight: '600',
                        color: log.max_risk < 0.3 ? '#10b981' : log.max_risk < 0.6 ? '#f59e0b' : '#ef4444'
                      }}>
                        {(log.max_risk * 100).toFixed(0)}%
                      </div>
                    </td>
                    <td>
                      <div style={{ fontFamily: 'Orbitron, monospace' }}>
                        {log.decision_count}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.875rem' }}>
                        {log.final_altitude.toFixed(0)}m
                      </div>
                    </td>
                    <td>
                      <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.875rem' }}>
                        {log.final_fuel.toFixed(1)}%
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </td>
                    <td>
                      <button
                        className="btn-secondary"
                        style={{
                          padding: '0.5rem 1rem',
                          fontSize: '0.75rem'
                        }}
                        onClick={() => alert(`Mission details for ${log.mission_id}\n\nIn a production system, this would show:\n- Complete telemetry history\n- All decision points\n- Full explanation traces\n- Downloadable data packages`)}
                        data-testid={`view-details-${log.id}`}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'rgba(17, 24, 39, 0.6)',
          border: '1px solid #1f2937',
          borderRadius: '8px'
        }} data-testid="data-note">
          <h3 style={{
            fontFamily: 'Orbitron, monospace',
            fontSize: '0.875rem',
            fontWeight: '600',
            marginBottom: '0.75rem',
            color: '#3b82f6'
          }}>
            ACCOUNTABILITY & TRANSPARENCY
          </h3>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: '#e0e6ed', marginBottom: '0.75rem' }}>
            Every autonomous mission generates a complete audit trail including:
          </p>
          <ul style={{ fontSize: '0.875rem', lineHeight: '1.6', color: '#e0e6ed', margin: 0, paddingLeft: '1.5rem' }}>
            <li>Time-series telemetry data from all sensors</li>
            <li>Risk assessment calculations at each decision point</li>
            <li>Rule evaluations and threshold checks</li>
            <li>Complete decision explanations with reasoning</li>
            <li>Action execution confirmations</li>
          </ul>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: '#9ca3af', marginTop: '0.75rem', marginBottom: 0 }}>
            <strong style={{ color: '#e0e6ed' }}>Note:</strong> Data shown represents simulated missions for demonstration purposes.
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default MissionLogs;
