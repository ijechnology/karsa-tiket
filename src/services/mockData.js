/**
 * Data contoh (mock data) persis dari Skema-Firestore-Karsa-Tiket.docx.md
 */

export const initialEvents = [
  {
    id: "Ev27dKm",
    nama: "Workshop Sablon Tote Bag",
    tanggal: "2026-10-18",
    lokasi: "Ruang Karsa, Jl. Merdeka No. 21",
    harga_tiket: 75000,
    kuota: 30,
    tiket_terjual: 2,
    dibuat_pada: "2026-10-01T08:00:00.000Z"
  },
  {
    id: "Ev89xPq",
    nama: "Konser Akustik Sore Senja",
    tanggal: "2026-10-25",
    lokasi: "Amfiteater Taman Budaya",
    harga_tiket: 50000,
    kuota: 50,
    tiket_terjual: 0,
    dibuat_pada: "2026-10-02T10:00:00.000Z"
  }
];

export const initialPembeli = [
  {
    id: "081355512345",
    nama: "Nadia Putri",
    no_whatsapp: "081355512345",
    email: "nadia.putri@contoh.id",
    dibuat_pada: "2026-10-01T08:30:00.000Z"
  },
  {
    id: "081298765432",
    nama: "Budi Santoso",
    no_whatsapp: "081298765432",
    email: "budi.santoso@contoh.id",
    dibuat_pada: "2026-10-02T09:15:00.000Z"
  }
];

export const initialTiket = [
  {
    id: "Tk63fHs",
    event_id: "Ev27dKm",
    nama_event: "Workshop Sablon Tote Bag",
    tanggal_event: "2026-10-18",
    pembeli_id: "081355512345",
    nama_pembeli: "Nadia Putri",
    harga_tiket: 75000,
    jumlah_tiket: 2,
    total: 150000,
    status: "menunggu_bayar",
    dibuat_pada: "2026-10-01T09:15:00.000Z"
  }
];
