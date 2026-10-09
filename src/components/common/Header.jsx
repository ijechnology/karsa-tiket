import React from 'react';

export default function Header({ isOnline = true, mode = 'mock' }) {
  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="brand-title">
          <span>🎟️ Karsa Tiket</span>
          <span className="brand-badge">
            {mode === 'firestore' ? 'Cloud Firestore' : 'Mock Data'}
          </span>
        </div>
      </div>
      <p className="brand-tagline">Manajemen Tiket Komunitas Kreatif</p>
    </header>
  );
}
