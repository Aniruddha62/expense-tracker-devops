import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Budget from './pages/Budget';
import Analytics from './pages/Analytics';

const NAV = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/expenses', label: 'Expenses', icon: '💸' },
  { to: '/budget', label: 'Budget', icon: '🎯' },
  { to: '/analytics', label: 'Analytics', icon: '📈' },
];

export default function App() {
  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9', fontFamily: 'system-ui,sans-serif' }}>
        {/* Sidebar */}
        <aside style={{ width: '220px', background: '#1e293b', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'fixed', height: '100vh' }}>
          <div style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '1.15rem', padding: '0.5rem', marginBottom: '1rem' }}>
            💰 ExpenseTracker
          </div>
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to} end={n.to === '/'}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.65rem 1rem', borderRadius: '8px', textDecoration: 'none',
                color: isActive ? '#fff' : '#94a3b8',
                background: isActive ? '#0ea5e9' : 'transparent',
                fontWeight: isActive ? '600' : '400',
                fontSize: '0.95rem',
              })}>
              {n.icon} {n.label}
            </NavLink>
          ))}
        </aside>

        {/* Main content */}
        <main style={{ marginLeft: '220px', flex: 1, padding: '2rem' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
