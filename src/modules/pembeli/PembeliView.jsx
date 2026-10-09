import React, { useState, useEffect } from 'react';
import { pembeliService } from '../../services';
import PembeliCard from './PembeliCard';
import PembeliFormModal from './PembeliFormModal';
import StateView from '../../components/common/StateView';
import ConfirmModal from '../../components/common/ConfirmModal';

export default function PembeliView({ showToast }) {
  const [pembeliList, setPembeliList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [state, setState] = useState('loading'); // 'loading' | 'empty' | 'error' | 'idle'
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [pembeliToEdit, setPembeliToEdit] = useState(null);
  const [pembeliToDelete, setPembeliToDelete] = useState(null);

  const fetchPembeli = async (query = searchQuery, forceError = false) => {
    setState('loading');
    try {
      const data = await pembeliService.getPembeli(query, forceError);
      setPembeliList(data);
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
    fetchPembeli();
  }, []);

  const handleSearchChange = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    fetchPembeli(q);
  };

  const handleOpenAdd = () => {
    setPembeliToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (p) => {
    setPembeliToEdit(p);
    setIsFormOpen(true);
  };

  const handleSave = async (formData) => {
    if (pembeliToEdit) {
      await pembeliService.updatePembeli(pembeliToEdit.no_whatsapp, formData);
      showToast('Data pembeli diperbarui.', 'success');
    } else {
      await pembeliService.createPembeli(formData);
      showToast('Pembeli baru didaftarkan.', 'success');
    }
    fetchPembeli(searchQuery);
  };

  const handleConfirmDelete = async () => {
    if (!pembeliToDelete) return;
    try {
      await pembeliService.deletePembeli(pembeliToDelete.no_whatsapp);
      showToast(`Data pembeli "${pembeliToDelete.nama}" telah dihapus.`, 'success');
      setPembeliToDelete(null);
      fetchPembeli(searchQuery);
    } catch (err) {
      showToast('Gagal menghapus pembeli: ' + err.message, 'error');
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Data Pembeli</h2>
          <p className="section-subtitle">Kelola kontak peserta dan pemesan tiket</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={handleOpenAdd}>
          + Tambah Pembeli
        </button>
      </div>

      <div className="search-container">
        <svg className="search-icon" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="search"
          className="search-input"
          placeholder="Cari berdasarkan nama atau WhatsApp..."
          value={searchQuery}
          onChange={handleSearchChange}
          aria-label="Cari pembeli"
        />
      </div>

      <StateView
        state={state}
        emptyTitle={searchQuery ? 'Hasil Pencarian Kosong' : 'Belum Ada Pembeli'}
        emptyDesc={
          searchQuery
            ? `Tidak ada kontak pembeli yang cocok dengan "${searchQuery}".`
            : 'Belum ada kontak pembeli yang tercatat di database.'
        }
        actionLabel={searchQuery ? 'Hapus Filter Pencarian' : '+ Tambah Pembeli'}
        onAction={searchQuery ? () => { setSearchQuery(''); fetchPembeli(''); } : handleOpenAdd}
        errorTitle="Gagal Memuat Pembeli"
        errorDesc="Terjadi kendala saat membaca data pembeli."
        onRetry={() => fetchPembeli(searchQuery, false)}
      >
        <div className="list-group">
          {pembeliList.map((p) => (
            <PembeliCard
              key={p.no_whatsapp}
              pembeli={p}
              onEdit={handleOpenEdit}
              onDelete={setPembeliToDelete}
            />
          ))}
        </div>
      </StateView>

      <PembeliFormModal
        isOpen={isFormOpen}
        pembeliToEdit={pembeliToEdit}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
      />

      <ConfirmModal
        isOpen={Boolean(pembeliToDelete)}
        title="Hapus Pembeli"
        message={`Apakah Anda yakin ingin menghapus "${pembeliToDelete?.nama}" (${pembeliToDelete?.no_whatsapp})? Data kontak tidak dapat dikembalikan.`}
        confirmLabel="Ya, Hapus Pembeli"
        isDanger={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPembeliToDelete(null)}
      />
    </div>
  );
}
