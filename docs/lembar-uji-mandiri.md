# Lembar Uji Mandiri: Karsa Tiket (Tiketing Event)

- **Nama Aplikasi:** Karsa Tiket (Tiketing Event)
- **Peserta:** Bootcamp Web Programming with AI by Plan Indonesia · Sesi 3
- **Dokumen Acuan:** `Tugas-Mandiri-Sesi-3.docx.md`, `PRD-Karsa-Tiket.docx.md`, `Skema-Firestore-Karsa-Tiket.docx.md`
- **Tanggal Pengujian:** 2026-10-09

---

## Tabel Hasil Uji: Enam Masukan Tidak Sah (Security Rules & Validasi)

| No | Kategori Uji | Skenario Masukan Tidak Sah | Koleksi | Hasil yang Diharapkan | Hasil Aktual | Status |
|:---|:---|:---|:---|:---|:---|:---|
| 1 | **Field Kosong** | Mengirim event baru tanpa mengisi `nama` atau `lokasi`. | `event` | Permintaan ditolak formulir dan security rules menolak dokumen yang tidak memiliki field string wajib berukuran minimal 1. | Ditolak dengan pesan *"Nama event wajib diisi"* dan error security rules Firestore jika dikirim langsung via API. | **LULUS (PASS)** |
| 2 | **Tipe Salah** | Mengirim nilai `harga_tiket` berupa teks string `"50000"` (bukan integer). | `event` | Ditolak oleh security rules (`request.resource.data.harga_tiket is int`). | Ditolak dengan galat Firebase *permission-denied*. | **LULUS (PASS)** |
| 3 | **Teks Terlalu Panjang** | Mengirim nama event dengan panjang 75 karakter (batas maksimal 60 karakter). | `event` | Ditolak oleh validasi formulir dan rules (`nama.size() <= 60`). | Ditolak dengan pesan *"Nama event maksimal 60 karakter"* dan ditolak security rules. | **LULUS (PASS)** |
| 4 | **Nilai Negatif** | Mengirim event dengan `harga_tiket: -25000`. | `event` | Ditolak oleh formulir dan rules (`harga_tiket >= 0`). | Ditolak dengan pesan *"Harga tiket minimal Rp 0"* dan ditolak security rules. | **LULUS (PASS)** |
| 5 | **Nilai di Luar Batas** | Mengirim pembuatan tiket dengan `jumlah_tiket: 6` atau `jumlah_tiket: 0` (batas 1 sampai 5). | `tiket` | Ditolak oleh formulir dan rules (`jumlah_tiket >= 1 && jumlah_tiket <= 5`). | Ditolak dengan pesan *"Jumlah tiket harus antara 1 sampai 5"* dan ditolak security rules. | **LULUS (PASS)** |
| 6 | **Perubahan Status Tidak Sah** | Mencoba mengubah status tiket dari `menunggu_bayar` langsung melompat ke `hadir` tanpa melalui status `lunas`. | `tiket` | Ditolak oleh state machine dan security rules yang hanya mengizinkan transisi `menunggu_bayar -> lunas` atau `menunggu_bayar -> dibatalkan`. | Ditolak oleh UI dan ditolak security rules (*permission-denied*). | **LULUS (PASS)** |

---

## Verifikasi 8 Kriteria Selesai (Tugas Mandiri Sesi 3)

| No | Kriteria Selesai | Cara Memeriksa | Bukti / Catatan | Status |
|:---|:---|:---|:---|:---|
| 1 | CRUD berjalan di ketiga koleksi | Tambah, ubah, dan hapus satu data per koleksi | Modul Event, Pembeli, dan Tiket memiliki fungsi Create, Read, Update, Delete lengkap. | **LULUS** |
| 2 | Nama koleksi dan field sesuai skema | Bandingkan dokumen dengan contoh di skema | Koleksi `event`, `pembeli`, dan `tiket` menggunakan penamaan dan tipe persis 100% dari skema. | **LULUS** |
| 3 | Total transaksi benar | Hitung manual satu transaksi dan cocokkan dengan nilai total | `total = harga_tiket * jumlah_tiket`. Teruji: Rp 75.000 × 2 = Rp 150.000 terkunci otomatis. | **LULUS** |
| 4 | Alur status sesuai PRD | Coba ubah status melompat (menunggu -> hadir) | Ditolak UI & rules. Alur: `menunggu_bayar` -> `lunas` -> `hadir` (atau `dibatalkan`). | **LULUS** |
| 5 | Tiga state tampil tepat | Loading, empty, dan error state di setiap modul | Komponen `StateView` menyediakan skeleton, empty dengan tombol tambah, dan error dengan tombol Coba Lagi. | **LULUS** |
| 6 | Hapus selalu dikonfirmasi | Tekan Hapus lalu Batal | Menggunakan `ConfirmModal` pada seluruh aksi hapus & pembatalan. Jika dibatalkan, data tetap utuh. | **LULUS** |
| 7 | Security rules menolak data tidak sah | Cek aturan di berkas `firestore.rules` | 6 skenario masukan tidak sah tertolak sesuai tabel di atas. | **LULUS** |
| 8 | Aplikasi tayang di Netlify | Konfigurasi build dan buka URL publik | Disediakan `netlify.toml` dan production bundle siap diterbitkan. | **SIAP** |
