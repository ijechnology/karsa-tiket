import React, { useState } from 'react';
import Header from './components/common/Header';
import BottomNav from './components/common/BottomNav';
import Toast from './components/common/Toast';
import { SERVICE_CONFIG } from './services/config';

export default function App() {
  const [activeTab, setActiveTab] = useState('event');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: '', type: 'success' });
  };

  return (
    <div className="app-container">
      <Header mode={SERVICE_CONFIG.MODE} />

      <main className="main-content">
        {activeTab === 'event' && (
          <section id="module-event">
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>Daftar Event</h2>
            <div className="card">
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Modul Event siap dibangun pada Task 2.</p>
            </div>
          </section>
        )}

        {activeTab === 'pembeli' && (
          <section id="module-pembeli">
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>Data Pembeli</h2>
            <div className="card">
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Modul Pembeli siap dibangun pada Task 3.</p>
            </div>
          </section>
        )}

        {activeTab === 'tiket' && (
          <section id="module-tiket">
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>Daftar Tiket</h2>
            <div className="card">
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Modul Tiket siap dibangun pada Task 4.</p>
            </div>
          </section>
        )}

        {activeTab === 'rekap' && (
          <section id="module-rekap">
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>Rekap Penjualan</h2>
            <div className="card">
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Modul Rekap siap dibangun pada Task 5.</p>
            </div>
          </section>
        )}
      </main>

      <Toast toast={toast} onClose={hideToast} />
      <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />
    </div>
  );
}
