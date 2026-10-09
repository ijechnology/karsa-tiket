# Spesifikasi Desain: Aplikasi Karsa Tiket (Tiketing Event)

- **Tanggal:** 2026-10-09
- **Status:** Approved Draft (Menunggu Review Akhir)
- **Konteks:** Tugas Mandiri Sesi 3 · Bootcamp Web Programming with AI by Plan Indonesia
- **Dokumen Acuan:**
  - `Tugas-Mandiri-Sesi-3.docx.md`
  - `PRD-Karsa-Tiket.docx.md`
  - `Skema-Firestore-Karsa-Tiket.docx.md`

---

## 1. Ringkasan Eksekutif & Tujuan

Karsa Tiket adalah aplikasi web responsif (mobile-first) untuk pengelolaan tiket komunitas kreatif yang menyelenggarakan workshop dan konser kecil. Aplikasi dirancang dalam konteks satu peran (latihan CRUD) untuk memecahkan 4 masalah utama:
1. Penjualan tiket melebihi kuota ruangan.
2. Status pembayaran tidak jelas.
3. Total transaksi dihitung manual.
4. Pembelian tiket bernilai nol atau tidak valid tetap tercatat.

Aplikasi dibangun bertahap mengikuti:
* **Bagian A:** Membangun antarmuka (UI) menggunakan data contoh (*mock data*), navigasi 4 menu, modal formulir, dialog konfirmasi hapus, serta Tiga State (*loading*, *empty*, *error*).
* **Bagian B:** Menghubungkan ke Cloud Firestore menggunakan modular SDK, menerapkan *security rules* ketat, memverifikasi 6 masukan tidak sah, dan menayangkan ke URL publik Netlify.

---

## 2. Pilihan Teknologi & Desain Sistem

### 2.1 Arsitektur Antarmuka
* **Framework:** React 19 (dibangun menggunakan Vite, template JavaScript).
* **Navigasi:** Mobile-first dengan Bottom Navigation Bar 4 menu (`event`, `pembeli`, `tiket`, `rekap`) + Header aplikasi yang bersih dan ergonomis untuk penggunaan satu tangan di layar ponsel.
* **Styling & Design System:** Modern Vanilla CSS menggunakan CSS Custom Properties (Design Tokens), tanpa Tailwind CSS atau library UI pihak ketiga.

### 2.2 Tema Visual & Craftsmanship (Anti-"AI Slop")
* **Filosofi Visual:** Handcrafted, bernuansa *indie studio & creative hub*, tajam, elegan, dan tanpa tampilan generik/template pabrikan AI.
* **Palet Warna:** **Deep Teal & Forest Slate** (Bebas warna Deep Indigo sesuai instruksi eksplisit pengguna):
  * Primary Accent: Deep Teal (`#0F766E` / `#0D9488`)
  * Surface & Background: Forest Slate / Neutral Slate (`#0F172A`, `#1E293B`, `#F8FAFC`, `#F1F5F9`)
  * Status Lunas / Success: Emerald (`#059669` / `#10B981`)
  * Status Menunggu Bayar / Warning: Warm Amber (`#D97706` / `#F59E0B`)
  * Status Dibatalkan / Danger: Rose Crimson (`#E11D48` / `#BE123C`)
  * Tipografi: System-UI / Plus Jakarta Sans fallback sans-serif dengan hierarki visual yang jelas, kontras teruji WCAG AA, dan *touch target* minimal 44x44px.

---

## 3. Struktur Direktori Proyek

```text
karsa-tiket/
├── public/
│   └── favicon.svg
├── src/
│   ├── index.css                   # Design tokens, reset, utility classes, typography
│   ├── main.jsx                    # React entry point
│   ├── App.jsx                     # Layout utama: Header, Active Screen, BottomNav, Toast
│   │
│   ├── components/common/          # Komponen inti terstandarisasi
│   │   ├── Header.jsx              # Identitas aplikasi Karsa Tiket
│   │   ├── BottomNav.jsx           # 4 Tab navigasi bawah ramah jempol
│   │   ├── StateView.jsx           # Tiga state: Loading, Empty (+CTA), Error (+Retry)
│   │   ├── ConfirmModal.jsx        # Dialog konfirmasi aksi destruktif (Hapus & Batal)
│   │   └── Toast.jsx               # Notifikasi umpan balik aksi pengguna
│   │
│   ├── modules/                    # Modul per kebutuhan PRD
│   │   ├── event/
│   │   │   ├── EventView.jsx       # Daftar event, tombol Tambah, filter/search
│   │   │   ├── EventCard.jsx       # Kartu acara, kuota, label "Habis", aksi Ubah/Hapus
│   │   │   └── EventFormModal.jsx  # Form Tambah/Ubah event (nama, tanggal, lokasi, harga, kuota)
│   │   ├── pembeli/
│   │   │   ├── PembeliView.jsx     # Daftar pembeli, input pencarian nama/no WhatsApp
│   │   │   ├── PembeliCard.jsx     # Kartu/baris informasi pembeli, aksi Ubah/Hapus
│   │   │   └── PembeliFormModal.jsx# Form Tambah/Ubah pembeli (nama, no_whatsapp, email)
│   │   ├── tiket/
│   │   │   ├── TiketView.jsx       # Daftar tiket, tab filter status
│   │   │   ├── TiketCard.jsx       # Kartu tiket, rincian, tombol alur status
│   │   │   └── TiketFormModal.jsx  # Form Buat Tiket (pilih event & pembeli, kuantitas 1-5)
│   │   └── rekap/
│   │       ├── RekapView.jsx       # Ringkasan per event (dropdown pilih event)
│   │       ├── MetricCard.jsx      # Kartu metrik: Terjual, Sisa Kuota, Pendapatan, Hadir
│   │       └── ProgressBar.jsx     # Visual persentase keterisian kuota
│   │
│   └── services/                   # Lapisan data terisolasi
│       ├── config.js               # Mode toggle ('mock' vs 'firestore')
│       ├── firebase.js             # Inisialisasi Firebase Modular SDK
│       ├── mockData.js             # Data contoh persis dari Skema Firestore
│       ├── mockService.js          # Implementasi simulasi CRUD lokal dengan delay & 3-state
│       ├── firestoreService.js     # Implementasi resmi Firestore modular SDK
│       └── index.js                # API service tunggal untuk komponen UI
│
├── firestore.rules                 # Security rules Cloud Firestore
├── netlify.toml                    # Konfigurasi build dan redirect Netlify
├── .env.example                    # Template environment variables Firebase
└── package.json
```

---

## 4. Skema Data & Tiga Aturan Nilai (*Invariants*)

Sesuai dokumen `Skema-Firestore-Karsa-Tiket.docx.md`, nama koleksi dan *field* digunakan persis apa adanya:

### 4.1 Koleksi `event`
* ID Dokumen: Otomatis (*auto-generated*)
* Fields:
  * `nama` (string, wajib, 1–60 karakter)
  * `tanggal` (string, wajib, format `YYYY-MM-DD`)
  * `lokasi` (string, wajib, 1–100 karakter)
  * `harga_tiket` (number bulat, wajib, >= 0, 0 = Gratis)
  * `kuota` (number bulat, wajib, 1–500)
  * `tiket_terjual` (number bulat, wajib, minimal 0, <= kuota, awal = 0)
  * `dibuat_pada` (timestamp, wajib)
* **Aturan:**
  * Sisa kuota tidak disimpan ke database, melainkan dihitung: `kuota - tiket_terjual`.
  * Jika `tiket_terjual == kuota`, kartu menampilkan label **"Habis"**.
  * Saat mengubah kuota event, kuota baru tidak boleh lebih kecil dari `tiket_terjual`.

### 4.2 Koleksi `pembeli`
* ID Dokumen: Nomor WhatsApp (`no_whatsapp`)
* Fields:
  * `nama` (string, wajib, 1–60 karakter)
  * `no_whatsapp` (string, wajib, diawali `08`, 10–13 digit angka)
  * `email` (string, wajib, mengandung `@`, maks 80 karakter)
  * `dibuat_pada` (timestamp, wajib)
* **Aturan:**
  * Sebelum menyimpan pembeli baru, sistem melakukan pemeriksaan `getDoc`. Jika nomor WhatsApp sudah ada, sistem menolak dengan pesan *"Nomor WhatsApp sudah terdaftar"*.

### 4.3 Koleksi `tiket`
* ID Dokumen: Otomatis (*auto-generated*)
* Fields:
  * `event_id` (string, wajib)
  * `nama_event` (string, wajib, snapshot nama event)
  * `tanggal_event` (string, wajib, snapshot tanggal event)
  * `pembeli_id` (string, wajib, nomor WhatsApp pembeli)
  * `nama_pembeli` (string, wajib, snapshot nama pembeli)
  * `harga_tiket` (number bulat, wajib, snapshot harga event)
  * `jumlah_tiket` (number bulat, wajib, 1–5 dan <= sisa kuota)
  * `total` (number bulat, wajib, `harga_tiket * jumlah_tiket`)
  * `status` (string, wajib, awal: `menunggu_bayar`)
  * `dibuat_pada` (timestamp, wajib)

### 4.4 Tiga Aturan Nilai (*Invariants*)
1. `harga_tiket` tidak pernah negatif dan `tiket_terjual` tidak pernah melebihi `kuota`.
2. `jumlah_tiket` selalu 1 sampai 5 dan tidak melebihi sisa kuota event saat ini.
3. `total` selalu sama dengan `harga_tiket * jumlah_tiket`.

---

## 5. Alur Status Transaksi (Koleksi `tiket`)

Mesin status berjalan searah dan menolak lompatan status:
* `menunggu_bayar` -> dapat berpindah ke:
  * `lunas` (setelah transfer dicek oleh panitia).
  * `dibatalkan` (jika pembeli batal sebelum membayar; aplikasi mengurangi `tiket_terjual` pada event sebesar `jumlah_tiket` via `increment(-jumlah_tiket)`).
* `lunas` -> dapat berpindah ke:
  * `hadir` (pada hari H saat peserta melakukan *check-in*).
* `hadir` -> status terminal (tidak dapat berubah lagi).
* `dibatalkan` -> status terminal (tidak dapat berubah lagi).

---

## 6. Modul Rekap

Rekap tidak menggunakan koleksi baru, melainkan membaca data dari koleksi `event` dan `tiket`:
1. Pengguna memilih event melalui dropdown/select.
2. Aplikasi menampilkan:
   * **Tiket Terjual:** angka dari `event.tiket_terjual`.
   * **Sisa Kuota:** `event.kuota - event.tiket_terjual`.
   * **Pendapatan:** penjumlahan `total` dari seluruh tiket dengan status `lunas` dan `hadir` (status `menunggu_bayar` dan `dibatalkan` tidak dihitung).
   * **Jumlah Hadir:** jumlah tiket / peserta dengan status `hadir`.
   * **Batang Kemajuan (Progress Bar):** persentase keterisian `(tiket_terjual / kuota) * 100%`.

---

## 7. Cloud Firestore Security Rules (`firestore.rules`)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isValidDate(str) {
      return str.matches('^[0-9]{4}-[0-9]{2}-[0-9]{2}$');
    }

    function isValidWA(str) {
      return str.matches('^08[0-9]{8,11}$');
    }

    function isValidEmail(str) {
      return str.size() <= 80 && str.matches('.*@.*');
    }

    // Koleksi event
    match /event/{eventId} {
      allow read: if true;
      allow create: if request.resource.data.nama is string &&
                      request.resource.data.nama.size() >= 1 && request.resource.data.nama.size() <= 60 &&
                      request.resource.data.lokasi is string &&
                      request.resource.data.lokasi.size() >= 1 && request.resource.data.lokasi.size() <= 100 &&
                      isValidDate(request.resource.data.tanggal) &&
                      request.resource.data.harga_tiket is int && request.resource.data.harga_tiket >= 0 &&
                      request.resource.data.kuota is int && request.resource.data.kuota >= 1 && request.resource.data.kuota <= 500 &&
                      request.resource.data.tiket_terjual is int && request.resource.data.tiket_terjual == 0 &&
                      request.resource.data.dibuat_pada is timestamp;
      
      allow update: if request.resource.data.nama is string &&
                      request.resource.data.nama.size() >= 1 && request.resource.data.nama.size() <= 60 &&
                      request.resource.data.lokasi is string &&
                      request.resource.data.lokasi.size() >= 1 && request.resource.data.lokasi.size() <= 100 &&
                      isValidDate(request.resource.data.tanggal) &&
                      request.resource.data.harga_tiket is int && request.resource.data.harga_tiket >= 0 &&
                      request.resource.data.kuota is int && request.resource.data.kuota >= 1 && request.resource.data.kuota <= 500 &&
                      request.resource.data.tiket_terjual is int &&
                      request.resource.data.tiket_terjual >= 0 &&
                      request.resource.data.tiket_terjual <= request.resource.data.kuota;

      allow delete: if true;
    }

    // Koleksi pembeli
    match /pembeli/{noWhatsapp} {
      allow read: if true;
      allow create, update: if request.resource.data.nama is string &&
                               request.resource.data.nama.size() >= 1 && request.resource.data.nama.size() <= 60 &&
                               request.resource.data.no_whatsapp == noWhatsapp &&
                               isValidWA(request.resource.data.no_whatsapp) &&
                               isValidEmail(request.resource.data.email) &&
                               request.resource.data.dibuat_pada is timestamp;

      allow delete: if true;
    }

    // Koleksi tiket
    match /tiket/{tiketId} {
      allow read: if true;
      allow create: if request.resource.data.jumlah_tiket is int &&
                      request.resource.data.jumlah_tiket >= 1 && request.resource.data.jumlah_tiket <= 5 &&
                      request.resource.data.harga_tiket is int && request.resource.data.harga_tiket >= 0 &&
                      request.resource.data.total == (request.resource.data.harga_tiket * request.resource.data.jumlah_tiket) &&
                      request.resource.data.status == 'menunggu_bayar' &&
                      request.resource.data.dibuat_pada is timestamp;

      allow update: if request.resource.data.diff(resource.data).affectedKeys().hasOnly(['status']) &&
                      (
                        (resource.data.status == 'menunggu_bayar' && (request.resource.data.status == 'lunas' || request.resource.data.status == 'dibatalkan')) ||
                        (resource.data.status == 'lunas' && request.resource.data.status == 'hadir')
                      );

      allow delete: if true;
    }
  }
}
```

---

## 8. Rencana Tahapan Eksekusi (Roadmap)

Sesuai `Tugas-Mandiri-Sesi-3.docx.md`:

### Bagian A · Membangun UI dengan Data Contoh
* **Tahap 1: Menyiapkan acuan & Fondasi Proyek**
  * Inisialisasi Vite + React, setup Design Tokens (`index.css`), layout responsif `App.jsx` + `BottomNav.jsx` + `Header.jsx`, komponen dasar `StateView`, `ConfirmModal`, dan `Toast`.
* **Tahap 2: Membangun UI CRUD per Koleksi**
  * CRUD koleksi master (`event`) dengan data contoh -> koleksi orang (`pembeli`) dengan pencarian -> koleksi transaksi (`tiket`) dengan alur status dinamis -> modul `rekap`.
* **Tahap 3: Memasang Tiga State**
  * Memastikan *loading*, *empty*, dan *error* state tampil sempurna dan memiliki tombol penanganan di setiap halaman daftar.

### Bagian B · Menghubungkan Data & Menayangkan
* **Tahap 4: Menghubungkan Cloud Firestore**
  * Konfigurasi Firebase Modular SDK (`firebase.js`), implementasi `firestoreService.js`, pengujian CRUD live Firestore, dan verifikasi `increment`.
* **Tahap 5: Aturan Data & Security Rules**
  * Validasi form sesuai kriteria PRD dan penulisan berkas `firestore.rules`. Menjalankan pengujian 6 masukan tidak sah dan membuat dokumen Lembar Uji Mandiri.
* **Tahap 6: Deploy ke Netlify**
  * Konfigurasi Netlify (`netlify.toml`), build production bundle, dan panduan/verifikasi publikasi ke URL publik Netlify.
