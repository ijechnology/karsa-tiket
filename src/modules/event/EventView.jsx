import React, { useState, useEffect } from 'react';
import { eventService } from '../../services';
import EventCard from './EventCard';
import EventFormModal from './EventFormModal';
import StateView from '../../components/common/StateView';
import ConfirmModal from '../../components/common/ConfirmModal';

export default function EventView({ showToast }) {
  const [events, setEvents] = useState([]);
  const [state, setState] = useState('loading'); // 'loading' | 'empty' | 'error' | 'idle'
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);

  const fetchEvents = async (forceError = false) => {
    setState('loading');
    try {
      const data = await eventService.getEvents(forceError);
      setEvents(data);
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
    fetchEvents();
  }, []);

  const handleOpenAdd = () => {
    setEventToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (evt) => {
    setEventToEdit(evt);
    setIsFormOpen(true);
  };

  const handleSave = async (formData) => {
    if (eventToEdit) {
      await eventService.updateEvent(eventToEdit.id, formData);
      showToast('Event berhasil diperbarui.', 'success');
    } else {
      await eventService.createEvent(formData);
      showToast('Event baru berhasil ditambahkan.', 'success');
    }
    fetchEvents();
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;
    try {
      await eventService.deleteEvent(eventToDelete.id);
      showToast(`Event "${eventToDelete.nama}" telah dihapus.`, 'success');
      setEventToDelete(null);
      fetchEvents();
    } catch (err) {
      showToast('Gagal menghapus event: ' + err.message, 'error');
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Daftar Event</h2>
          <p className="section-subtitle">Kelola jadwal acara dan alokasi kuota tiket</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={handleOpenAdd}>
          + Tambah Event
        </button>
      </div>

      <StateView
        state={state}
        emptyTitle="Belum Ada Event"
        emptyDesc="Belum ada acara yang didaftarkan. Buat event pertama untuk mulai membuka kuota tiket."
        actionLabel="+ Tambah Event Pertama"
        onAction={handleOpenAdd}
        errorTitle="Gagal Memuat Event"
        errorDesc="Terjadi kendala saat membaca daftar acara."
        onRetry={() => fetchEvents(false)}
      >
        {events.length > 0 && (
          <div className="bento-overview-grid">
            <div className="bento-stat-card">
              <span className="bento-label">Total Acara</span>
              <span className="bento-value">{events.length}</span>
              <span className="bento-subtext">Jadwal aktif</span>
            </div>
            <div className="bento-stat-card">
              <span className="bento-label">Tiket Dipesan</span>
              <span className="bento-value">
                {events.reduce((acc, e) => acc + (e.tiket_terjual || 0), 0)}
              </span>
              <span className="bento-subtext">Kursi terisi</span>
            </div>
            <div className="bento-stat-card">
              <span className="bento-label">Sisa Kuota</span>
              <span className="bento-value" style={{ color: 'var(--primary)' }}>
                {events.reduce((acc, e) => acc + Math.max(0, e.kuota - (e.tiket_terjual || 0)), 0)}
              </span>
              <span className="bento-subtext">Siap dipesan</span>
            </div>
          </div>
        )}

        <div className="list-group">
          {events.map((evt) => (
            <EventCard
              key={evt.id}
              event={evt}
              onEdit={handleOpenEdit}
              onDelete={setEventToDelete}
            />
          ))}
        </div>
      </StateView>

      <EventFormModal
        isOpen={isFormOpen}
        eventToEdit={eventToEdit}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
      />

      <ConfirmModal
        isOpen={Boolean(eventToDelete)}
        title="Hapus Event"
        message={`Apakah Anda yakin ingin menghapus event "${eventToDelete?.nama}"? Seluruh data yang berkaitan akan terhapus.`}
        confirmLabel="Ya, Hapus Event"
        isDanger={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setEventToDelete(null)}
      />
    </div>
  );
}
