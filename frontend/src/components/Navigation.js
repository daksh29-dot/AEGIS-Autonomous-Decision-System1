import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Overview' },
    { path: '/architecture', label: 'Architecture' },
    { path: '/mission', label: 'Live Mission' },
    { path: '/decision', label: 'Decision Explanation' },
    { path: '/risk', label: 'Risk Assessment' },
    { path: '/simulator', label: 'Scenario Simulator' },
    { path: '/logs', label: 'Mission Logs' },
    { path: '/technical', label: 'Technical Notes' }
  ];
  
  return (
    <nav style={{
      background: 'rgba(17, 24, 39, 0.95)',
      borderBottom: '1px solid #1f2937',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 1.5rem',
        display: 'flex',
        overflowX: 'auto',
        gap: '0.5rem'
      }}>
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
