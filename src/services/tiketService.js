import { initialTiket } from './mockData';
import { mockEventService } from './eventService';

const STORAGE_KEY = 'karsa_mock_tiket';

function getStoredTiket() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTiket));
    return [...initialTiket];
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return [...initialTiket];
  }
}

function saveTiket(tiketList) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tiketList));
}

export const mockTiketService = {
  async getTiket(statusFilter = 'semua', forceError = false) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (forceError) {
      throw new Error('Koneksi terputus saat mengambil daftar tiket.');
    }
    const tiketList = getStoredTiket();
    const sorted = [...tiketList].sort((a, b) => new Date(b.dibuat_pada) - new Date(a.dibuat_pada));

    if (!statusFilter || statusFilter === 'semua') {
      return sorted;
    }
    return sorted.filter((t) => t.status === statusFilter);
  },

  async createTiket(tiketInput) {
    await new Promise((resolve) => setTimeout(resolve, 350));
    const tiketList = getStoredTiket();

    const jumlah = parseInt(tiketInput.jumlah_tiket, 10);
    if (isNaN(jumlah) || jumlah < 1 || jumlah > 5) {
      throw new Error('Jumlah tiket harus berupa angka antara 1 sampai 5.');
    }

    // Ambil data event untuk validasi kuota & snapshot
    const events = await mockEventService.getEvents();
    const event = events.find((e) => e.id === tiketInput.event_id);
    if (!event) {
      throw new Error('Event yang dipilih tidak valid.');
    }

    const sisaKuota = Math.max(0, event.kuota - (event.tiket_terjual || 0));
    if (jumlah > sisaKuota) {
      throw new Error(`Jumlah tiket (${jumlah}) melebihi sisa kuota yang tersedia (${sisaKuota}).`);
    }

    const total = event.harga_tiket * jumlah;

    const newTiket = {
      id: 'Tk' + Math.random().toString(36).substring(2, 7),
      event_id: event.id,
      nama_event: event.nama,
      tanggal_event: event.tanggal,
      pembeli_id: tiketInput.pembeli_id,
      nama_pembeli: tiketInput.nama_pembeli,
      harga_tiket: event.harga_tiket,
      jumlah_tiket: jumlah,
      total: total,
      status: 'menunggu_bayar',
      dibuat_pada: new Date().toISOString()
    };

    // Tambah kuota terjual pada event
    await mockEventService.incrementTiketTerjual(event.id, jumlah);

    tiketList.unshift(newTiket);
    saveTiket(tiketList);
    return newTiket;
  },

  async updateTiketStatus(id, currentStatus, newStatus) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const tiketList = getStoredTiket();
    const index = tiketList.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error('Tiket tidak ditemukan.');
    }

    const tiket = tiketList[index];

    // Validasi alur status ketat (State Machine)
    const isValidTransition =
      (tiket.status === 'menunggu_bayar' && (newStatus === 'lunas' || newStatus === 'dibatalkan')) ||
      (tiket.status === 'lunas' && newStatus === 'hadir');

    if (!isValidTransition) {
      throw new Error(`Perubahan status dari "${tiket.status}" ke "${newStatus}" tidak diizinkan.`);
    }

    // Jika dibatalkan, kembalikan kuota ke event
    if (newStatus === 'dibatalkan') {
      await mockEventService.incrementTiketTerjual(tiket.event_id, -tiket.jumlah_tiket);
    }

    tiket.status = newStatus;
    tiketList[index] = tiket;
    saveTiket(tiketList);
    return tiket;
  },

  async deleteTiket(id) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const tiketList = getStoredTiket();
    const filtered = tiketList.filter((t) => t.id !== id);
    saveTiket(filtered);
    return true;
  }
};
