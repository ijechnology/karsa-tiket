# 🎟️ Karsa Tiket — Layanan Tiketing Komunitas Kreatif

> **Tugas Mandiri Sesi 3 · Bootcamp Web Programming with AI by Plan Indonesia**  
> Dibuat dengan React 19, Vite, Modern Vanilla CSS Design Tokens, dan Cloud Firestore.

---

## 📋 1. Ringkasan Proyek

**Karsa Tiket** adalah aplikasi web responsif (*mobile-first*) yang dibangun untuk mengelola penjualan tiket event komunitas kreatif (workshop sablon, konser intim sore, pameran seni, dll.). Aplikasi ini menyelesaikan masalah operasional di mana sebelumnya tiket pernah terjual melebihi kapasitas ruangan, status pembayaran tidak jelas, dan total transaksi dihitung manual.

### 🌟 Fitur Utama
* **CRUD Lengkap 3 Koleksi:**
  * **Event:** Kelola jadwal acara, lokasi, harga tiket, dan kuota. Dilengkapi badge status otomatis (*Sisa Kuota* / *Habis*).
  * **Pembeli:** Kelola data kontak peserta (Nama, WhatsApp, Email). Pengecekan nomor WhatsApp unik terintegrasi.
  * **Tiket:** Penerbitan tiket (1–5 tiket dengan batas sisa kuota event), kalkulasi total otomatis, dan salinan snapshot data historis.
* **Modul Rekapitulasi:** Ringkasan metrik per event (Tiket Terjual, Sisa Kuota, Total Pendapatan, dan Kehadiran Peserta) dilengkapi visualisasi *Progress Bar* keterisian kursi. Sesuai PRD, pendapatan hanya menghitung tiket berstatus *Lunas* dan *Hadir*.
* **Alur Status Transaksi Ketat (*State Machine*):**
  * `menunggu_bayar` ➜ `lunas` ➜ `hadir` (Check-in Hari H)
  * `menunggu_bayar` ➜ `dibatalkan` (Kuota dikembalikan otomatis ke event)
* **Tiga State di Setiap Modul:** Tampilan responsif untuk kondisi *Loading* (Skeleton animasi), *Empty* (Pesan informatif + tombol aksi), dan *Error* (Kotak galat + tombol *Coba Lagi*).
* **Desain Non-AI-Slop & Bebas Deep Indigo:** Menggunakan palet elegan **Deep Teal & Forest Slate** dengan tipografi *Plus Jakarta Sans*, kontras teruji WCAG AA, dan tata letak navigasi bawah (*Bottom Navigation Bar*) yang ergonomis untuk layar ponsel.

---

## 🗄️ 2. Skema Cloud Firestore

Penamaan koleksi dan field mengikuti `Skema-Firestore-Karsa-Tiket.docx.md` secara persis:

| Koleksi | ID Dokumen | Field & Tipe |
|:---|:---|:---|
| `event` | Otomatis | `nama` (str), `tanggal` (str `YYYY-MM-DD`), `lokasi` (str), `harga_tiket` (int), `kuota` (int), `tiket_terjual` (int), `dibuat_pada` (timestamp) |
| `pembeli` | Nomor WhatsApp | `nama` (str), `no_whatsapp` (str `08...`), `email` (str), `dibuat_pada` (timestamp) |
| `tiket` | Otomatis | `event_id` (str), `nama_event` (str), `tanggal_event` (str), `pembeli_id` (str), `nama_pembeli` (str), `harga_tiket` (int), `jumlah_tiket` (int 1–5), `total` (int), `status` (str), `dibuat_pada` (timestamp) |

---

## 🔒 3. Security Rules (`firestore.rules`)

Berkas `firestore.rules` menjaga 3 aturan nilai (*invariants*) di tingkat server database:
1. `harga_tiket >= 0` dan `tiket_terjual <= kuota`.
2. `jumlah_tiket` berada di antara 1 sampai 5 dan tidak melebihi sisa kuota.
3. `total == harga_tiket * jumlah_tiket`.
4. Menolak perubahan status tiket yang melompat atau mundur (hanya mengizinkan `menunggu_bayar -> lunas/dibatalkan` dan `lunas -> hadir`).

Hasil uji 6 masukan tidak sah dicatat pada: [`docs/lembar-uji-mandiri.md`](docs/lembar-uji-mandiri.md).

---

## 🚀 4. Cara Menjalankan Secara Lokal

### Prasyarat
* Node.js v18+ atau v20+ / v22+
* npm v10+

### Langkah-langkah
1. **Clone repositori dan pasang dependensi:**
   ```bash
   git clone <url-repo-anda>
   cd karsa-tiket
   npm install
   ```

2. **Menjalankan dalam Mode Data Contoh (Mock Data - Default):**
   ```bash
   npm run dev
   ```
   Aplikasi langsung dapat diuji dengan data awal dari skema tanpa memerlukan konfigurasi database eksternal.

3. **Menghubungkan ke Cloud Firestore (Opsional):**
   * Buat file `.env` dengan menyalin template `.env.example`:
     ```bash
     cp .env.example .env
     ```
   * Isi konfigurasi Firebase dari Firebase Console.
   * Ubah `MODE` pada `src/services/config.js` menjadi `'firestore'`.

4. **Menjalankan Build Produksi:**
   ```bash
   npm run build
   ```

---

## 🌐 5. Panduan Publikasi ke Netlify

1. Hubungkan repositori GitHub Anda ke **Netlify**.
2. Konfigurasi build otomatis terdeteksi via [`netlify.toml`](netlify.toml):
   * **Build Command:** `npm run build`
   * **Publish Directory:** `dist`
3. Jika menggunakan Cloud Firestore live, masukkan *Environment Variables* di menu:  
   `Site configuration` ➜ `Environment variables` sesuai isi `.env.example`.
4. Buka URL publik Netlify yang dihasilkan untuk pengujian dan pengumpulan tugas.

---

## ✅ 6. Checklist Kriteria Selesai (Tugas Mandiri Sesi 3)

- [x] **CRUD berjalan di ketiga koleksi:** Tambah, lihat, ubah, dan hapus event, pembeli, dan tiket.
- [x] **Nama koleksi dan field persis sesuai skema:** 100% patuh tanpa penambahan field di luar acuan.
- [x] **Total transaksi dihitung otomatis:** Formula `harga_tiket × jumlah_tiket` terkunci dan snapshot tersimpan.
- [x] **Alur status sesuai PRD:** State machine menolak lompatan status; pembatalan mengembalikan kuota.
- [x] **Tiga state tampil tepat:** State *loading*, *empty* (dengan CTA), dan *error* (dengan tombol Coba Lagi).
- [x] **Hapus selalu dikonfirmasi:** Dialog konfirmasi mencegah penghapusan data secara tidak sengaja.
- [x] **Security rules menolak data tidak sah:** 6 uji masukan tidak sah terdokumentasi dan lulus.
- [x] **Aplikasi siap tayang di Netlify:** Konfigurasi `netlify.toml` dan bundle siap terbit.
