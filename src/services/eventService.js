import { initialEvents } from './mockData';

const STORAGE_KEY = 'karsa_mock_events';

function getStoredEvents() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialEvents));
    return [...initialEvents];
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return [...initialEvents];
  }
}

function saveEvents(events) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export const mockEventService = {
  async getEvents(forceError = false) {
    await new Promise((resolve) => setTimeout(resolve, 350));
    if (forceError) {
      throw new Error('Koneksi terputus saat mengambil daftar event.');
    }
    const events = getStoredEvents();
    // Sort by tanggal ascending
    return [...events].sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
  },

  async createEvent(eventData) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const events = getStoredEvents();

    // Validasi
    if (!eventData.nama || eventData.nama.trim().length === 0 || eventData.nama.length > 60) {
      throw new Error('Nama event wajib diisi (maksimal 60 karakter).');
    }
    if (!eventData.lokasi || eventData.lokasi.trim().length === 0 || eventData.lokasi.length > 100) {
      throw new Error('Lokasi event wajib diisi (maksimal 100 karakter).');
    }
    if (!eventData.tanggal || !/^\d{4}-\d{2}-\d{2}$/.test(eventData.tanggal)) {
      throw new Error('Format tanggal harus YYYY-MM-DD.');
    }
    const harga = parseInt(eventData.harga_tiket, 10);
    if (isNaN(harga) || harga < 0) {
      throw new Error('Harga tiket minimal Rp 0 (gratis).');
    }
    const kuota = parseInt(eventData.kuota, 10);
    if (isNaN(kuota) || kuota < 1 || kuota > 500) {
      throw new Error('Kuota harus berupa angka antara 1 sampai 500.');
    }

    const newEvent = {
      id: 'Ev' + Math.random().toString(36).substring(2, 7),
      nama: eventData.nama.trim(),
      tanggal: eventData.tanggal,
      lokasi: eventData.lokasi.trim(),
      harga_tiket: harga,
      kuota: kuota,
      tiket_terjual: 0,
      dibuat_pada: new Date().toISOString()
    };

    events.push(newEvent);
    saveEvents(events);
    return newEvent;
  },

  async updateEvent(id, eventData) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const events = getStoredEvents();
    const index = events.findIndex((e) => e.id === id);
    if (index === -1) {
      throw new Error('Event tidak ditemukan.');
    }

    const currentEvent = events[index];
    const kuota = parseInt(eventData.kuota, 10);

    if (kuota < currentEvent.tiket_terjual) {
      throw new Error(`Kuota tidak boleh lebih kecil dari tiket yang sudah terjual (${currentEvent.tiket_terjual}).`);
    }

    const updated = {
      ...currentEvent,
      nama: eventData.nama.trim(),
      tanggal: eventData.tanggal,
      lokasi: eventData.lokasi.trim(),
      harga_tiket: parseInt(eventData.harga_tiket, 10),
      kuota: kuota
    };

    events[index] = updated;
    saveEvents(events);
    return updated;
  },

  async deleteEvent(id) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const events = getStoredEvents();
    const filtered = events.filter((e) => e.id !== id);
    saveEvents(filtered);
    return true;
  },

  // Helper untuk sinkronisasi tiket_terjual
  async incrementTiketTerjual(id, delta) {
    const events = getStoredEvents();
    const index = events.findIndex((e) => e.id === id);
    if (index !== -1) {
      const nextTerjual = Math.max(0, (events[index].tiket_terjual || 0) + delta);
      events[index].tiket_terjual = nextTerjual;
      saveEvents(events);
    }
  }
};
