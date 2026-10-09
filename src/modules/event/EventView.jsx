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
      showToast('Event berhasil diperbarui!', 'success');
    } else {
      await eventService.createEvent(formData);
      showToast('Event baru berhasil ditambahkan!', 'success');
    }
    fetchEvents();
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;
    try {
      await eventService.deleteEvent(eventToDelete.id);
      showToast(`Event "${eventToDelete.nama}" berhasil dihapus.`, 'success');
      setEventToDelete(null);
      fetchEvents();
    } catch (err) {
      showToast('Gagal menghapus event: ' + err.message, 'error');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>Daftar Event</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Kelola jadwal acara dan kuota tiket</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={handleOpenAdd}>
          ➕ Tambah Event
        </button>
      </div>

      <StateView
        state={state}
        emptyTitle="Belum Ada Event"
        emptyDesc="Belum ada acara yang didaftarkan. Buat event pertama untuk mulai menjual tiket."
        actionLabel="➕ Tambah Event Pertama"
        onAction={handleOpenAdd}
        errorTitle="Gagal Memuat Event"
        errorDesc="Terjadi kendala saat menghubungi basis data."
        onRetry={() => fetchEvents(false)}
      >
        <div className="event-list">
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
