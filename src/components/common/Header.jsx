import React from 'react';

export default function Header({ mode = 'mock' }) {
  return (
    <header className="app-header">
      <div className="header-brand">
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            background: 'linear-gradient(135deg, #0F766E, #115E59)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 2px 6px rgba(15, 118, 110, 0.25)'
          }}
          aria-hidden="true"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
            <path d="M13 5v2" />
            <path d="M13 17v2" />
          </svg>
        </div>
        <h1 className="brand-title">Karsa Tiket</h1>
      </div>
      <div className="header-status-indicator">
        <span className="dot" aria-hidden="true" style={{ boxShadow: '0 0 0 3px rgba(15, 118, 110, 0.15)' }} />
        <span>{mode === 'firestore' ? 'Cloud Firestore' : 'Data Lokal'}</span>
      </div>
    </header>
  );
}
