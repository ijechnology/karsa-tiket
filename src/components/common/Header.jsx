import React from 'react';

export default function Header({ mode = 'mock' }) {
  return (
    <header className="app-header">
      <div className="header-brand">
        <h1 className="brand-title">Karsa Tiket</h1>
      </div>
      <div className="header-status-indicator">
        <span className="dot" aria-hidden="true"></span>
        <span>{mode === 'firestore' ? 'Cloud Firestore' : 'Data Lokal'}</span>
      </div>
    </header>
  );
}
