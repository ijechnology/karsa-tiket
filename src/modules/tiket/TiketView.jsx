import React, { useState, useEffect } from 'react';
import { tiketService } from '../../services';
import TiketCard from './TiketCard';
import TiketFormModal from './TiketFormModal';
import StateView from '../../components/common/StateView';
import ConfirmModal from '../../components/common/ConfirmModal';

export default function TiketView({ showToast }) {
  const [tiketList, setTiketList] = useState([]);
  const [activeStatusTab, setActiveStatusTab] = useState('semua');
  const [state, setState] = useState('loading'); // 'loading' | 'empty' | 'error' | 'idle'
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [tiketToCancel, setTiketToCancel] = useState(null);
  const [tiketToDelete, setTiketToDelete] = useState(null);

  const statusTabs = [
    { id: 'semua', label: 'Semua' },
    { id: 'menunggu_bayar', label: 'Menunggu' },
    { id: 'lunas', label: 'Lunas' },
    { id: 'hadir', label: 'Hadir' },
    { id: 'dibatalkan', label: 'Batal' }
  ];

  const fetchTiket = async (tab = activeStatusTab, forceError = false) => {
    setState('loading');
    try {
      const data = await tiketService.getTiket(tab, forceError);
      setTiketList(data);
      if (data.length === 0) {
        setState('empty');
      } else {
        setState('idle');
      }
    } catch (err) {
      setState('error');
    }
  };

  useEffect(() => {
    fetchTiket(activeStatusTab);
  }, [activeStatusTab]);

  const handleTabChange = (tabId) => {
    setActiveStatusTab(tabId);
  };

  const handleSaveTiket = async (tiketData) => {
    await tiketService.createTiket(tiketData);
    showToast('Tiket berhasil diterbitkan.', 'success');
    fetchTiket(activeStatusTab);
  };

  const handleUpdateStatus = async (tiketId, currentStatus, newStatus) => {
    try {
      await tiketService.updateTiketStatus(tiketId, currentStatus, newStatus);
      showToast(`Status tiket diubah ke "${newStatus}".`, 'success');
      fetchTiket(activeStatusTab);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleConfirmCancel = async () => {
    if (!tiketToCancel) return;
    try {
      await tiketService.updateTiketStatus(tiketToCancel.id, tiketToCancel.status, 'dibatalkan');
      showToast('Tiket telah dibatalkan dan kuota dikembalikan.', 'success');
      setTiketToCancel(null);
      fetchTiket(activeStatusTab);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!tiketToDelete) return;
    try {
      await tiketService.deleteTiket(tiketToDelete.id);
      showToast('Tiket telah dihapus.', 'success');
      setTiketToDelete(null);
      fetchTiket(activeStatusTab);
    } catch (err) {
      showToast('Gagal menghapus tiket: ' + err.message, 'error');
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Daftar Tiket</h2>
          <p className="section-subtitle">Kelola pesanan, verifikasi transfer, dan check-in acara</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setIsFormOpen(true)}>
          + Buat Tiket
        </button>
      </div>

      {/* Segmented Filter Control */}
      <div className="segmented-tabs" role="tablist" aria-label="Filter status tiket">
        {statusTabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={activeStatusTab === t.id}
            className={`tab-btn ${activeStatusTab === t.id ? 'active' : ''}`}
            onClick={() => handleTabChange(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <StateView
        state={state}
        emptyTitle="Belum Ada Tiket"
        emptyDesc={
          activeStatusTab !== 'semua'
            ? `Tidak ada transaksi berstatus "${activeStatusTab}".`
            : 'Belum ada transaksi tiket yang tercatat.'
        }
        actionLabel={activeStatusTab === 'semua' ? '+ Terbitkan Tiket' : 'Tampilkan Semua'}
        onAction={activeStatusTab === 'semua' ? () => setIsFormOpen(true) : () => setActiveStatusTab('semua')}
        errorTitle="Gagal Memuat Tiket"
        errorDesc="Terjadi kendala saat membaca data transaksi tiket."
        onRetry={() => fetchTiket(activeStatusTab, false)}
      >
        <div className="list-group">
          {tiketList.map((t) => (
            <TiketCard
              key={t.id}
              tiket={t}
              onUpdateStatus={handleUpdateStatus}
              onCancelTiket={setTiketToCancel}
              onDelete={setTiketToDelete}
            />
          ))}
        </div>
      </StateView>

      <TiketFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveTiket}
      />

      <ConfirmModal
        isOpen={Boolean(tiketToCancel)}
        title="Batalkan Tiket"
        message={`Batalkan tiket #${tiketToCancel?.id} atas nama ${tiketToCancel?.nama_pembeli}? Kuota sebanyak ${tiketToCancel?.jumlah_tiket} tiket akan dikembalikan ke event.`}
        confirmLabel="Ya, Batalkan Tiket"
        isDanger={true}
        onConfirm={handleConfirmCancel}
        onCancel={() => setTiketToCancel(null)}
      />

      <ConfirmModal
        isOpen={Boolean(tiketToDelete)}
        title="Hapus Tiket"
        message={`Hapus data tiket #${tiketToDelete?.id}? Tindakan ini bersifat permanen.`}
        confirmLabel="Ya, Hapus Data"
        isDanger={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setTiketToDelete(null)}
      />
    </div>
  );
}
