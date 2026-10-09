import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  where,
  increment,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

export const firestoreEventService = {
  async getEvents() {
    if (!db) throw new Error('Firestore belum diinisialisasi. Periksa .env.');
    const q = query(collection(db, 'event'), orderBy('tanggal'), limit(20));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }));
  },

  async createEvent(eventData) {
    if (!db) throw new Error('Firestore belum diinisialisasi. Periksa .env.');
    const harga = parseInt(eventData.harga_tiket, 10);
    const kuota = parseInt(eventData.kuota, 10);

    const docRef = await addDoc(collection(db, 'event'), {
      nama: eventData.nama.trim(),
      tanggal: eventData.tanggal,
      lokasi: eventData.lokasi.trim(),
      harga_tiket: harga,
      kuota: kuota,
      tiket_terjual: 0,
      dibuat_pada: serverTimestamp()
    });

    return { id: docRef.id, ...eventData, tiket_terjual: 0 };
  },

  async updateEvent(id, eventData) {
    if (!db) throw new Error('Firestore belum diinisialisasi. Periksa .env.');
    const eventRef = doc(db, 'event', id);
    const snap = await getDoc(eventRef);
    if (!snap.exists()) throw new Error('Event tidak ditemukan.');

    const currentData = snap.data();
    const kuota = parseInt(eventData.kuota, 10);
    if (kuota < (currentData.tiket_terjual || 0)) {
      throw new Error(`Kuota tidak boleh lebih kecil dari tiket terjual (${currentData.tiket_terjual}).`);
    }

    await updateDoc(eventRef, {
      nama: eventData.nama.trim(),
      tanggal: eventData.tanggal,
      lokasi: eventData.lokasi.trim(),
      harga_tiket: parseInt(eventData.harga_tiket, 10),
      kuota: kuota
    });

    return { id, ...eventData };
  },

  async deleteEvent(id) {
    if (!db) throw new Error('Firestore belum diinisialisasi. Periksa .env.');
    await deleteDoc(doc(db, 'event', id));
    return true;
  },

  async incrementTiketTerjual(id, delta) {
    if (!db) return;
    const eventRef = doc(db, 'event', id);
    await updateDoc(eventRef, {
      tiket_terjual: increment(delta)
    });
  }
};

export const firestorePembeliService = {
  async getPembeli(searchQuery = '') {
    if (!db) throw new Error('Firestore belum diinisialisasi. Periksa .env.');
    const q = query(collection(db, 'pembeli'), orderBy('nama'), limit(20));
    const snapshot = await getDocs(q);
    const list = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data()
    }));

    if (!searchQuery.trim()) return list;

    const queryLower = searchQuery.toLowerCase().trim();
    return list.filter(
      (p) =>
        (p.nama && p.nama.toLowerCase().includes(queryLower)) ||
        (p.no_whatsapp && p.no_whatsapp.includes(queryLower))
    );
  },

  async checkPembeliExists(noWhatsapp) {
    if (!db) return false;
    const snap = await getDoc(doc(db, 'pembeli', noWhatsapp));
    return snap.exists();
  },

  async createPembeli(pembeliData) {
    if (!db) throw new Error('Firestore belum diinisialisasi. Periksa .env.');
    const noWA = pembeliData.no_whatsapp.trim();
    const docRef = doc(db, 'pembeli', noWA);

    // Cek apakah nomor WhatsApp sudah terdaftar
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      throw new Error('Nomor WhatsApp sudah terdaftar.');
    }

    await setDoc(docRef, {
      nama: pembeliData.nama.trim(),
      no_whatsapp: noWA,
      email: pembeliData.email.trim(),
      dibuat_pada: serverTimestamp()
    });

    return { id: noWA, ...pembeliData };
  },

  async updatePembeli(noWhatsapp, pembeliData) {
    if (!db) throw new Error('Firestore belum diinisialisasi. Periksa .env.');
    const docRef = doc(db, 'pembeli', noWhatsapp);
    await updateDoc(docRef, {
      nama: pembeliData.nama.trim(),
      email: pembeliData.email.trim()
    });
    return { id: noWhatsapp, ...pembeliData };
  },

  async deletePembeli(noWhatsapp) {
    if (!db) throw new Error('Firestore belum diinisialisasi. Periksa .env.');
    await deleteDoc(doc(db, 'pembeli', noWhatsapp));
    return true;
  }
};

export const firestoreTiketService = {
  async getTiket(statusFilter = 'semua') {
    if (!db) throw new Error('Firestore belum diinisialisasi. Periksa .env.');
    const q = query(collection(db, 'tiket'), orderBy('dibuat_pada', 'desc'), limit(20));
    const snapshot = await getDocs(q);
    const list = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data()
    }));

    if (!statusFilter || statusFilter === 'semua') return list;
    return list.filter((t) => t.status === statusFilter);
  },

  async createTiket(tiketInput) {
    if (!db) throw new Error('Firestore belum diinisialisasi. Periksa .env.');
    const jumlah = parseInt(tiketInput.jumlah_tiket, 10);

    // Ambil data event untuk validasi kuota
    const eventRef = doc(db, 'event', tiketInput.event_id);
    const eventSnap = await getDoc(eventRef);
    if (!eventSnap.exists()) throw new Error('Event tidak ditemukan.');

    const event = eventSnap.data();
    const sisaKuota = Math.max(0, event.kuota - (event.tiket_terjual || 0));
    if (jumlah > sisaKuota) {
      throw new Error(`Jumlah tiket (${jumlah}) melebihi sisa kuota yang tersedia (${sisaKuota}).`);
    }

    const total = event.harga_tiket * jumlah;

    const tiketDocRef = await addDoc(collection(db, 'tiket'), {
      event_id: tiketInput.event_id,
      nama_event: event.nama,
      tanggal_event: event.tanggal,
      pembeli_id: tiketInput.pembeli_id,
      nama_pembeli: tiketInput.nama_pembeli,
      harga_tiket: event.harga_tiket,
      jumlah_tiket: jumlah,
      total: total,
      status: 'menunggu_bayar',
      dibuat_pada: serverTimestamp()
    });

    // Tambah tiket_terjual pada event
    await updateDoc(eventRef, {
      tiket_terjual: increment(jumlah)
    });

    return { id: tiketDocRef.id, ...tiketInput, total, status: 'menunggu_bayar' };
  },

  async updateTiketStatus(id, currentStatus, newStatus) {
    if (!db) throw new Error('Firestore belum diinisialisasi. Periksa .env.');
    const tiketRef = doc(db, 'tiket', id);
    const snap = await getDoc(tiketRef);
    if (!snap.exists()) throw new Error('Tiket tidak ditemukan.');

    const tiket = snap.data();

    // Validasi alur transisi status
    const isValidTransition =
      (tiket.status === 'menunggu_bayar' && (newStatus === 'lunas' || newStatus === 'dibatalkan')) ||
      (tiket.status === 'lunas' && newStatus === 'hadir');

    if (!isValidTransition) {
      throw new Error(`Perubahan status dari "${tiket.status}" ke "${newStatus}" tidak diizinkan.`);
    }

    // Jika dibatalkan, kurangi kuota pada event
    if (newStatus === 'dibatalkan') {
      const eventRef = doc(db, 'event', tiket.event_id);
      await updateDoc(eventRef, {
        tiket_terjual: increment(-tiket.jumlah_tiket)
      });
    }

    await updateDoc(tiketRef, {
      status: newStatus
    });

    return { id, ...tiket, status: newStatus };
  },

  async deleteTiket(id) {
    if (!db) throw new Error('Firestore belum diinisialisasi. Periksa .env.');
    await deleteDoc(doc(db, 'tiket', id));
    return true;
  }
};

export const firestoreRekapService = {
  async getRekapByEvent(eventId) {
    if (!db) throw new Error('Firestore belum diinisialisasi. Periksa .env.');
    const eventRef = doc(db, 'event', eventId);
    const eventSnap = await getDoc(eventRef);
    if (!eventSnap.exists()) throw new Error('Event tidak ditemukan.');

    const event = { id: eventSnap.id, ...eventSnap.data() };

    const q = query(collection(db, 'tiket'), where('event_id', '==', eventId));
    const tiketSnap = await getDocs(q);
    const tickets = tiketSnap.docs.map((d) => d.data());

    // Pendapatan hanya dari status lunas dan hadir
    const validTickets = tickets.filter((t) => t.status === 'lunas' || t.status === 'hadir');
    const totalPendapatan = validTickets.reduce((sum, t) => sum + (t.total || 0), 0);

    const totalHadir = tickets
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
      total_transaksi: tickets.length,
      persentase
    };
  }
};
