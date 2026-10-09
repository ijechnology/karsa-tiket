import React, { useState } from 'react';
import Header from './components/common/Header';
import BottomNav from './components/common/BottomNav';
import Toast from './components/common/Toast';
import EventView from './modules/event/EventView';
import PembeliView from './modules/pembeli/PembeliView';
import TiketView from './modules/tiket/TiketView';
import RekapView from './modules/rekap/RekapView';
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
          <EventView showToast={showToast} />
        )}

        {activeTab === 'pembeli' && (
          <PembeliView showToast={showToast} />
        )}

        {activeTab === 'tiket' && (
          <TiketView showToast={showToast} />
        )}

        {activeTab === 'rekap' && (
          <RekapView />
        )}
      </main>

      <Toast toast={toast} onClose={hideToast} />
      <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />
    </div>
  );
}
