import { mockEventService } from './eventService';
import { mockTiketService } from './tiketService';

export const mockRekapService = {
  async getRekapByEvent(eventId, forceError = false) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (forceError) {
      throw new Error('Koneksi terputus saat menghitung ringkasan rekap.');
    }

    const events = await mockEventService.getEvents();
    const event = events.find((e) => e.id === eventId);
    if (!event) {
      throw new Error('Event tidak ditemukan.');
    }

    const allTiket = await mockTiketService.getTiket('semua');
    const eventTiket = allTiket.filter((t) => t.event_id === eventId);

    // Hitung pendapatan HANYA dari tiket lunas dan hadir (PRD 5.4 Acceptance Criteria 2)
    const validTiket = eventTiket.filter((t) => t.status === 'lunas' || t.status === 'hadir');
    const totalPendapatan = validTiket.reduce((sum, t) => sum + (t.total || 0), 0);

    // Hitung jumlah kehadiran
    const totalHadir = eventTiket
      .filter((t) => t.status === 'hadir')
      .reduce((sum, t) => sum + (t.jumlah_tiket || 1), 0);

    const tiketTerjual = event.tiket_terjual || 0;
    const sisaKuota = Math.max(0, event.kuota - tiketTerjual);
    const persentase = event.kuota > 0 ? Math.min(100, Math.round((tiketTerjual / event.kuota) * 100)) : 0;

    return {
      event,
      tiket_terjual: tiketTerjual,
      sisa_kuota: sisaKuota,
      pendapatan: totalPendapatan,
      jumlah_hadir: totalHadir,
      total_transaksi: eventTiket.length,
      persentase: persentase
    };
  }
};
