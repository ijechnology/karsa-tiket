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
      showToast('Data pembeli berhasil diperbarui!', 'success');
    } else {
      await pembeliService.createPembeli(formData);
      showToast('Pembeli baru berhasil didaftarkan!', 'success');
    }
    fetchPembeli(searchQuery);
  };

  const handleConfirmDelete = async () => {
    if (!pembeliToDelete) return;
    try {
      await pembeliService.deletePembeli(pembeliToDelete.no_whatsapp);
      showToast(`Pembeli "${pembeliToDelete.nama}" berhasil dihapus.`, 'success');
      setPembeliToDelete(null);
      fetchPembeli(searchQuery);
    } catch (err) {
      showToast('Gagal menghapus data pembeli: ' + err.message, 'error');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>Data Pembeli</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Kelola kontak peserta dan pemesan tiket</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={handleOpenAdd}>
          ➕ Tambah Pembeli
        </button>
      </div>

      <div style={{ marginBottom: '14px' }}>
        <input
          type="search"
          className="form-input"
          placeholder="🔍 Cari nama atau nomor WhatsApp..."
          value={searchQuery}
          onChange={handleSearchChange}
          aria-label="Cari pembeli"
        />
      </div>

      <StateView
        state={state}
        emptyTitle={searchQuery ? 'Tidak Ada Hasil Pencarian' : 'Belum Ada Pembeli'}
        emptyDesc={
          searchQuery
            ? `Tidak ditemukan pembeli yang cocok dengan kata kunci "${searchQuery}".`
            : 'Belum ada data kontak pembeli yang tercatat.'
        }
        actionLabel={searchQuery ? 'Reset Pencarian' : '➕ Tambah Pembeli'}
        onAction={searchQuery ? () => { setSearchQuery(''); fetchPembeli(''); } : handleOpenAdd}
        errorTitle="Gagal Memuat Data Pembeli"
        errorDesc="Terjadi kendala saat mengambil data dari sistem."
        onRetry={() => fetchPembeli(searchQuery, false)}
      >
        <div className="pembeli-list">
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
        confirmLabel="Ya, Hapus Data"
        isDanger={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPembeliToDelete(null)}
      />
    </div>
  );
}
