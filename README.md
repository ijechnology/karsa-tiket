# Karsa Tiket: Layanan Tiketing Komunitas Kreatif

## Ringkasan Proyek

**Karsa Tiket** adalah aplikasi web responsif (*mobile-first*) yang dibangun untuk mengelola penjualan tiket event komunitas kreatif (workshop sablon, konser intim sore, pameran seni, dll.). Aplikasi ini menyelesaikan masalah operasional di mana sebelumnya tiket pernah terjual melebihi kapasitas ruangan, status pembayaran tidak jelas, dan total transaksi dihitung manual.

### Fitur Utama
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

## Skema Cloud Firestore

Penamaan koleksi dan field mengikuti `Skema-Firestore-Karsa-Tiket.docx.md` secara persis:

| Koleksi | ID Dokumen | Field & Tipe |
|:---|:---|:---|
| `event` | Otomatis | `nama` (str), `tanggal` (str `YYYY-MM-DD`), `lokasi` (str), `harga_tiket` (int), `kuota` (int), `tiket_terjual` (int), `dibuat_pada` (timestamp) |
| `pembeli` | Nomor WhatsApp | `nama` (str), `no_whatsapp` (str `08...`), `email` (str), `dibuat_pada` (timestamp) |
| `tiket` | Otomatis | `event_id` (str), `nama_event` (str), `tanggal_event` (str), `pembeli_id` (str), `nama_pembeli` (str), `harga_tiket` (int), `jumlah_tiket` (int 1–5), `total` (int), `status` (str), `dibuat_pada` (timestamp) |

---

## Security Rules (`firestore.rules`)

Berkas `firestore.rules` menjaga 3 aturan nilai (*invariants*) di tingkat server database:
1. `harga_tiket >= 0` dan `tiket_terjual <= kuota`.
2. `jumlah_tiket` berada di antara 1 sampai 5 dan tidak melebihi sisa kuota.
3. `total == harga_tiket * jumlah_tiket`.
4. Menolak perubahan status tiket yang melompat atau mundur (hanya mengizinkan `menunggu_bayar -> lunas/dibatalkan` dan `lunas -> hadir`).

Hasil uji 6 masukan tidak sah dicatat pada: [`docs/lembar-uji-mandiri.md`](docs/lembar-uji-mandiri.md).

---

## Hasil Deployment di Netlify

https://web-karsa-tiket.netlify.app/
