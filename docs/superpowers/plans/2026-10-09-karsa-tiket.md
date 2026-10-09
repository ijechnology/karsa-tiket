# Karsa Tiket (Tiketing Event) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun aplikasi web responsif Karsa Tiket (Tiketing Event) mulai dari UI dengan data contoh (mock), koneksi Cloud Firestore, penegakan Firestore Security Rules, pengujian 6 masukan tidak sah, hingga konfigurasi deployment Netlify sesuai PRD dan panduan Tugas Mandiri Sesi 3.

**Architecture:** Progressive feature-based component architecture dengan Unified Service Adapter (`services/index.js`) yang mengisolasi UI dari sumber data, memungkinkan transisi bertahap dari Mock Data (Bagian A) ke Cloud Firestore (Bagian B) tanpa merombak komponen antarmuka. Styling menggunakan Modern Vanilla CSS Design Tokens bertema Deep Teal & Forest Slate dengan layout mobile-first Bottom Navigation Bar.

**Tech Stack:** React 19, Vite, Modern Vanilla CSS (Design Tokens), Firebase Modular SDK v11 (Cloud Firestore), Netlify.

**Spec:** `docs/superpowers/specs/2026-10-09-karsa-tiket-design.md`

## Global Constraints

- Sesuai `Skema-Firestore-Karsa-Tiket.docx.md`: nama koleksi wajib huruf kecil tunggal (`event`, `pembeli`, `tiket`).
- Nama *field* wajib persis sesuai skema: `nama`, `tanggal`, `lokasi`, `harga_tiket`, `kuota`, `tiket_terjual`, `dibuat_pada`, `no_whatsapp`, `email`, `event_id`, `nama_event`, `tanggal_event`, `pembeli_id`, `nama_pembeli`, `jumlah_tiket`, `total`, `status`.
- Larangan keras penggunaan warna Deep Indigo — gunakan palet terkurasi Deep Teal (`#0F766E`) dan Forest Slate (`#0F172A`, `#1E293B`).
- Standar kualitas non-AI slop: tipografi tajam, hierarki visual jelas, teks antarmuka natural berbahasa Indonesia, tombol hapus selalu dikonfirmasi dialog.
- Tiga State wajib ada di setiap modul daftar: *loading*, *empty* (lengkap dengan CTA), dan *error* (lengkap dengan tombol "Coba Lagi").
- Mesin status tiket satu arah: `menunggu_bayar` -> `lunas` -> `hadir`, atau `menunggu_bayar` -> `dibatalkan`. Status tidak boleh melompat atau mundur.
- Konsistensi kuota: saat tiket dibuat `tiket_terjual` bertambah `+jumlah_tiket`, saat dibatalkan berkurang `-jumlah_tiket`.
- Pendapatan di modul Rekap hanya menghitung tiket berstatus `lunas` dan `hadir`.

## Review Focus

1. **Percobaan membeli tiket melebihi sisa kuota event:** formulir harus menghitung `sisa_kuota = kuota - tiket_terjual` dan memblokir input jika `jumlah_tiket > sisa_kuota`.
2. **Duplikasi nomor WhatsApp pembeli:** pencatatan pembeli baru harus memeriksa keberadaan dokumen `pembeli/{no_whatsapp}`; jika sudah ada, tolak dengan pesan *"Nomor WhatsApp sudah terdaftar"*.
3. **Lompatan status tidak sah:** tiket `menunggu_bayar` tidak boleh langsung diubah menjadi `hadir` tanpa melewati `lunas`.
4. **Pembatalan tiket mengembalikan kuota event:** saat tiket dibatalkan, `tiket_terjual` pada event harus berkurang sejumlah `jumlah_tiket` yang dibatalkan.
5. **Perubahan harga event di kemudian hari tidak merusak transaksi lama:** snapshot `harga_tiket` dan `total` tersimpan permanen di dokumen tiket.

---

### Task 1: Project Scaffolding, Design Tokens, & Core Shared Components

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/index.css`
- Create: `src/main.jsx`
- Create: `src/App.jsx`
- Create: `src/components/common/Header.jsx`
- Create: `src/components/common/BottomNav.jsx`
- Create: `src/components/common/StateView.jsx`
- Create: `src/components/common/ConfirmModal.jsx`
- Create: `src/components/common/Toast.jsx`
- Create: `src/services/config.js`
- Create: `src/services/mockData.js`

**Interfaces:**
- Produces:
  - `BottomNav`: `({ activeTab, onChangeTab }) => JSX` (tabs: `'event'`, `'pembeli'`, `'tiket'`, `'rekap'`)
  - `StateView`: `({ state: 'loading'|'empty'|'error', emptyTitle, emptyDesc, onAction, actionLabel, errorTitle, errorDesc, onRetry, children }) => JSX`
  - `ConfirmModal`: `({ isOpen, title, message, confirmLabel, isDanger, onConfirm, onCancel }) => JSX`
  - `Toast`: `({ toast: { show, message, type }, onClose }) => JSX`
  - `initialData`: `{ initialEvents, initialPembeli, initialTiket }`

- [ ] **Step 1: Inisialisasi Vite + React scaffolding**
  - Buat `package.json` dengan dependencies `react`, `react-dom`, dan devDependencies `vite`, `@vitejs/plugin-react`.
  - Buat `vite.config.js` dan `index.html`.
  - Jalankan instalasi: `npm install`
  - Verifikasi: `npx vite build --help` berjalan sukses.

- [ ] **Step 2: Implementasi Design Tokens & Global CSS (`src/index.css`)**
  - Definisikan CSS variables: `--primary-teal: #0F766E`, `--primary-teal-hover: #0D9488`, `--bg-slate: #0F172A`, `--surface-card: #FFFFFF`, `--surface-muted: #F8FAFC`, `--border-color: #E2E8F0`, `--status-lunas: #059669`, `--status-menunggu: #D97706`, `--status-batal: #E11D48`.
  - Reset CSS, tipografi clean, mobile-first utility classes, dan layout container.

- [ ] **Step 3: Implementasi Shared Components (`Header`, `BottomNav`, `StateView`, `ConfirmModal`, `Toast`)**
  - Buat `Header.jsx` dengan logo/title "Karsa Tiket" dan subtitle acara kreatif.
  - Buat `BottomNav.jsx` dengan 4 tombol menu berikon SVG jernih: Event, Pembeli, Tiket, Rekap.
  - Buat `StateView.jsx` dengan 3 state: Skeleton loader (`loading`), pesan informatif + tombol CTA (`empty`), dan kartu galat + tombol "Coba Lagi" (`error`).
  - Buat `ConfirmModal.jsx` untuk konfirmasi hapus/batal.
  - Buat `Toast.jsx` untuk pop up notifikasi sukses/galat.

- [ ] **Step 4: Siapkan `src/services/mockData.js` dan `src/services/config.js`**
  - Isi `mockData.js` dengan data contoh persis dari dokumen skema:
    - Event: `Ev27dKm` ("Workshop Sablon Tote Bag", tanggal 2026-10-18, lokasi "Ruang Karsa", harga 75000, kuota 30, terjual 2).
    - Pembeli: `081355512345` ("Nadia Putri", email `nadia.putri@contoh.id`).
    - Tiket: `Tk63fHs` (event `Ev27dKm`, pembeli `081355512345`, harga 75000, jumlah 2, total 150000, status `menunggu_bayar`).
  - Set `src/services/config.js` dengan `MODE: 'mock'`.

- [ ] **Step 5: Verifikasi build dan tampilan Shell App**
  - Jalankan `npm run build`
  - Expected: Build sukses menghasilkan direktori `dist/` tanpa warning sintaks.
  - Commit: `git add . && git commit -m "feat: scaffold project with design tokens and core shared components"`

---

### Task 2: Modul Event (Master Data) & Tiga State dengan Mock Service

**Files:**
- Create: `src/services/eventService.js`
- Create: `src/modules/event/EventView.jsx`
- Create: `src/modules/event/EventCard.jsx`
- Create: `src/modules/event/EventFormModal.jsx`
- Modify: `src/services/index.js`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes:
  - `StateView`, `ConfirmModal`, `Toast` dari `components/common/`
- Produces:
  - `eventService`: `{ getEvents(), createEvent(data), updateEvent(id, data), deleteEvent(id) }`
  - `EventView`: `() => JSX`

- [ ] **Step 1: Implementasi `src/services/eventService.js` (Mock implementation)**
  - `getEvents()`: mengembalikan daftar event, disortir berdasarkan tanggal asc, delay tiruan 300ms.
  - `createEvent(data)`: validasi `nama`, `tanggal`, `lokasi`, `harga_tiket >= 0`, `kuota 1-500`, set `tiket_terjual = 0`, simpan ke state mock.
  - `updateEvent(id, data)`: validasi `kuota >= tiket_terjual`.
  - `deleteEvent(id)`: menghapus event dari data mock.

- [ ] **Step 2: Implementasi `EventCard.jsx` dan `EventFormModal.jsx`**
  - `EventCard`: menampilkan nama acara, tanggal format rapi, lokasi, harga (format Rupiah `Rp 75.000` atau "Gratis"), sisa kuota (`kuota - tiket_terjual`), badge "Habis" jika sisa kuota 0, tombol Ubah dan Hapus.
  - `EventFormModal`: input nama (1-60 karakter), tanggal (date picker `YYYY-MM-DD`), lokasi (1-100 karakter), harga tiket (number $\ge 0$), kuota (number 1-500). Validasi client-side ramah pengguna.

- [ ] **Step 3: Implementasi `EventView.jsx` dengan 3-State**
  - State: `loading` saat memuat data.
  - State: `empty` saat list kosong -> menampilkan pesan *"Belum ada event"* dan tombol CTA *"+ Tambah Event"*.
  - State: `error` saat terjadi kegagalan -> menampilkan tombol *"Coba Lagi"*.
  - Menghubungkan dialog konfirmasi hapus sebelum memanggil `deleteEvent`.
  - Menampilkan Toast sukses saat event berhasil ditambah/diubah/dihapus.

- [ ] **Step 4: Verifikasi & Commit**
  - Uji alur Event: Tambah event baru, Ubah event, Hapus event dengan konfirmasi Batal vs Setuju, verifikasi badge Habis saat kuota = terjual.
  - Jalankan `npm run build`
  - Commit: `git add . && git commit -m "feat: implement event module with full CRUD and 3-state handling"`

---

### Task 3: Modul Pembeli (Data Orang) dengan Pencarian & Mock Service

**Files:**
- Create: `src/services/pembeliService.js`
- Create: `src/modules/pembeli/PembeliView.jsx`
- Create: `src/modules/pembeli/PembeliCard.jsx`
- Create: `src/modules/pembeli/PembeliFormModal.jsx`
- Modify: `src/services/index.js`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes:
  - `StateView`, `ConfirmModal`, `Toast` dari `components/common/`
- Produces:
  - `pembeliService`: `{ getPembeli(search), checkPembeliExists(noWhatsapp), createPembeli(data), updatePembeli(noWhatsapp, data), deletePembeli(noWhatsapp) }`
  - `PembeliView`: `() => JSX`

- [ ] **Step 1: Implementasi `src/services/pembeliService.js` (Mock implementation)**
  - `getPembeli(searchQuery)`: filter berdasarkan kecocokan `nama` (case-insensitive) atau `no_whatsapp`.
  - `createPembeli(data)`: cek apakah `no_whatsapp` sudah ada; jika sudah ada, tolak dengan error *"Nomor WhatsApp sudah terdaftar"*. Validasi format `08` (10-13 digit) dan email mengandung `@`.
  - `updatePembeli(noWhatsapp, data)`: perbarui data pembeli.
  - `deletePembeli(noWhatsapp)`: hapus data pembeli.

- [ ] **Step 2: Implementasi `PembeliCard.jsx` dan `PembeliFormModal.jsx`**
  - `PembeliCard`: kartu kontak menampilkan nama, no WhatsApp (link klik langsung chat/telpon), dan email, tombol Ubah dan Hapus.
  - `PembeliFormModal`: input nama, nomor WhatsApp (dengan placeholder `0813xxxxxxxx`), email. Pesan error validasi tampil di bawah masing-masing field.

- [ ] **Step 3: Implementasi `PembeliView.jsx` dengan Search Bar & 3-State**
  - Input pencarian langsung (*real-time filter*) untuk nama atau nomor WA.
  - Loading, Empty state (*"Belum ada pembeli"* + tombol *"+ Tambah Pembeli"*), dan Error state.
  - Integrasi modal konfirmasi hapus dan toast notifikasi.

- [ ] **Step 4: Verifikasi & Commit**
  - Uji coba tambah pembeli baru dengan nomor WA yang sama $\to$ pastikan ditolak dengan pesan yang benar.
  - Uji pencarian pembeli berdasarkan sebagian nama.
  - Jalankan `npm run build`
  - Commit: `git add . && git commit -m "feat: implement pembeli module with duplicate check and search filter"`

---

### Task 4: Modul Tiket (Transaksi) & Alur Status Mesin dengan Mock Service

**Files:**
- Create: `src/services/tiketService.js`
- Create: `src/modules/tiket/TiketView.jsx`
- Create: `src/modules/tiket/TiketCard.jsx`
- Create: `src/modules/tiket/TiketFormModal.jsx`
- Modify: `src/services/index.js`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes:
  - `eventService`, `pembeliService`, `StateView`, `ConfirmModal`, `Toast`
- Produces:
  - `tiketService`: `{ getTiket(statusFilter), createTiket(data), updateTiketStatus(id, currentStatus, newStatus), deleteTiket(id) }`
  - `TiketView`: `() => JSX`

- [ ] **Step 1: Implementasi `src/services/tiketService.js` (Mock implementation)**
  - `createTiket(data)`:
    - Ambil event; hitung `sisa_kuota = event.kuota - event.tiket_terjual`.
    - Validasi `jumlah_tiket >= 1 && jumlah_tiket <= 5` dan `jumlah_tiket <= sisa_kuota`.
    - Salin snapshot: `nama_event`, `tanggal_event`, `harga_tiket`, `nama_pembeli`, `pembeli_id`.
    - Hitung `total = harga_tiket * jumlah_tiket`.
    - Set status awal: `menunggu_bayar`.
    - Tambah `tiket_terjual` pada event sebesar `+jumlah_tiket`.
  - `updateTiketStatus(id, currentStatus, newStatus)`:
    - Validasi transisi sah:
      - `menunggu_bayar` hanya boleh ke `lunas` atau `dibatalkan`.
      - `lunas` hanya boleh ke `hadir`.
      - Jika beralih ke `dibatalkan`: kurangi `tiket_terjual` pada event sebesar `-jumlah_tiket`.

- [ ] **Step 2: Implementasi `TiketCard.jsx` dan `TiketFormModal.jsx`**
  - `TiketCard`: menampilkan judul event, tanggal acara, nama & WA pembeli, jumlah tiket, total nominal (Rp), badge status warna warni (Amber: `menunggu_bayar`, Emerald: `lunas`, Teal: `hadir`, Rose: `dibatalkan`).
  - Tombol aksi kontekstual:
    - Jika `menunggu_bayar`: tombol "Konfirmasi Lunas" & tombol "Batalkan".
    - Jika `lunas`: tombol "Check-in Hadir".
    - Jika `hadir` / `dibatalkan`: badge statis tanpa tombol ubah status.
  - `TiketFormModal`: dropdown pilih event (menampilkan nama event & sisa kuota), dropdown pilih pembeli, input jumlah tiket (1-5 dengan batas maksimum sesuai sisa kuota), rincian kalkulasi total otomatis `harga_tiket x jumlah`.

- [ ] **Step 3: Implementasi `TiketView.jsx` dengan Filter Tabs & 3-State**
  - Tabs filter status: Semua, Menunggu Bayar, Lunas, Hadir, Dibatalkan.
  - Loading state, Empty state (*"Belum ada tiket"* + tombol *"+ Buat Tiket"*), Error state.
  - Hubungkan konfirmasi dialog saat membatalkan tiket atau menghapus tiket.

- [ ] **Step 4: Verifikasi & Commit**
  - Buat tiket baru $\to$ cek sisa kuota event berkurang $\to$ ubah ke lunas $\to$ check-in hadir.
  - Buat tiket baru $\to$ batalkan $\to$ cek kuota event bertambah kembali.
  - Jalankan `npm run build`
  - Commit: `git add . && git commit -m "feat: implement tiket module with strict status workflow and quota syncing"`

---

### Task 5: Modul Rekap & Ringkasan Penjualan

**Files:**
- Create: `src/services/rekapService.js`
- Create: `src/modules/rekap/RekapView.jsx`
- Create: `src/modules/rekap/MetricCard.jsx`
- Create: `src/modules/rekap/ProgressBar.jsx`
- Modify: `src/services/index.js`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes:
  - `eventService`, `tiketService`, `StateView`
- Produces:
  - `rekapService`: `{ getRekapByEvent(eventId) }`
  - `RekapView`: `() => JSX`

- [ ] **Step 1: Implementasi `src/services/rekapService.js`**
  - Ambil dokumen event berdasarkan `eventId`.
  - Ambil seluruh tiket dengan `event_id == eventId`.
  - Hitung metrik:
    - `tiket_terjual`: dari event `tiket_terjual`
    - `sisa_kuota`: `event.kuota - event.tiket_terjual`
    - `pendapatan`: jumlah total tiket berstatus `lunas` dan `hadir` (tiket `menunggu_bayar` dan `dibatalkan` tidak dihitung)
    - `jumlah_hadir`: total peserta tiket berstatus `hadir`
    - `persentase_terjual`: `Math.round((event.tiket_terjual / event.kuota) * 100)`

- [ ] **Step 2: Implementasi `MetricCard.jsx`, `ProgressBar.jsx`, dan `RekapView.jsx`**
  - `MetricCard`: kartu angka dengan visual bersih, ikon representatif, dan aksen warna Deep Teal.
  - `ProgressBar`: batang kemajuan visual keterisian kursi event dengan label persentase.
  - `RekapView`: dropdown pemilih event, loading skeleton, empty state (jika belum ada event atau belum ada tiket), dan kartu metrik 4 kuadran.

- [ ] **Step 3: Verifikasi & Commit**
  - Uji perhitungan rekap: pastikan tiket menunggu_bayar tidak menambah nominal pendapatan; setelah diubah ke lunas, pastikan pendapatan bertambah sesuai total tiket.
  - Jalankan `npm run build`
  - Commit: `git add . && git commit -m "feat: implement rekap module with revenue and attendance aggregation"`

---

### Task 6: Firebase Modular SDK & Cloud Firestore Service Layer

**Files:**
- Create: `.env.example`
- Create: `src/services/firebase.js`
- Create: `src/services/firestoreService.js`
- Modify: `src/services/index.js`
- Modify: `src/services/config.js`

**Interfaces:**
- Consumes:
  - Firebase Modular SDK (`firebase/app`, `firebase/firestore`)
- Produces:
  - `firestoreService`: implementasi Firestore resmi untuk `eventService`, `pembeliService`, `tiketService`, dan `rekapService` menggunakan `getDocs`, `getDoc`, `addDoc`, `setDoc`, `updateDoc`, `deleteDoc`, `increment`, `serverTimestamp`.

- [ ] **Step 1: Install Firebase SDK & Siapkan Inisialisasi**
  - Jalankan `npm install firebase`
  - Buat `.env.example` dengan kunci: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`.
  - Buat `src/services/firebase.js` yang membaca environment variables tersebut secara aman dan mengekspor `db` (`getFirestore(app)`).

- [ ] **Step 2: Implementasi `src/services/firestoreService.js`**
  - Implementasi operasi Firestore modular sesuai Bagian 5 & Skema PRD:
    - Event: `collection(db, "event")`, `orderBy("tanggal")`, `limit(20)`.
    - Pembeli: `doc(db, "pembeli", noWhatsapp)`, `setDoc`, `getDoc` untuk validasi duplikat.
    - Tiket: `collection(db, "tiket")`, `orderBy("dibuat_pada", "desc")`, `limit(20)`, sinkronisasi kuota via `updateDoc(doc(db, "event", eventId), { tiket_terjual: increment(jumlah) })`.
    - Rekap: `getDoc` event + `getDocs(query(collection(db, "tiket"), where("event_id", "==", eventId)))`.

- [ ] **Step 3: Hubungkan Service Adapter (`src/services/index.js`)**
  - Buat mekanisme switch mulus di `src/services/index.js`: jika Firebase config terisi, arahkan ke `firestoreService`; jika tidak, fallback aman ke `mockService` dengan penanda status di console atau header.

- [ ] **Step 4: Verifikasi & Commit**
  - Jalankan `npm run build` untuk memastikan tidak ada kesalahan impor atau bundling Firebase SDK.
  - Commit: `git add . && git commit -m "feat: implement firestore modular service layer with fallback adapter"`

---

### Task 7: Cloud Firestore Security Rules & Lembar Uji Mandiri

**Files:**
- Create: `firestore.rules`
- Create: `docs/lembar-uji-mandiri.md`
- Create: `test-rules-runner.js` (atau skrip uji terotomasi untuk memverifikasi 6 masukan tidak sah)

**Interfaces:**
- Produces:
  - `firestore.rules`: Dokumen aturan resmi Firestore yang menolak masukan tidak sah.
  - `docs/lembar-uji-mandiri.md`: Hasil uji 6 masukan tidak sah sesuai Tugas Mandiri Sesi 3.

- [ ] **Step 1: Tulis `firestore.rules`**
  - Tulis aturan lengkap sesuai Bab 7 Spesifikasi Desain:
    - Aturan `event`: validasi ukuran nama (1-60), lokasi (1-100), regex tanggal `YYYY-MM-DD`, harga $\ge 0$, kuota 1-500, tiket_terjual awal 0 dan tidak melebihi kuota.
    - Aturan `pembeli`: ID dokumen == `no_whatsapp`, regex format WA `^08[0-9]{8,11}$`, email mengandung `@` dan $\le 80$ karakter.
    - Aturan `tiket`: `jumlah_tiket` 1-5, `total == harga_tiket * jumlah_tiket`, status awal `menunggu_bayar`, transisi update hanya boleh `menunggu_bayar` $\to$ `lunas`/`dibatalkan`, dan `lunas` $\to$ `hadir`.

- [ ] **Step 2: Jalankan Pengujian 6 Masukan Tidak Sah**
  - Uji 1: Field kosong (simpan event tanpa nama/lokasi) $\to$ Ditolak.
  - Uji 2: Tipe salah (harga_tiket berupa teks string) $\to$ Ditolak.
  - Uji 3: Teks terlalu panjang (nama event > 60 karakter) $\to$ Ditolak.
  - Uji 4: Nilai negatif (harga_tiket < 0) $\to$ Ditolak.
  - Uji 5: Nilai di luar batas (jumlah_tiket = 6 atau kuota = 600) $\to$ Ditolak.
  - Uji 6: Perubahan status tidak sah (`menunggu_bayar` langsung melompat ke `hadir`) $\to$ Ditolak.

- [ ] **Step 3: Catat Hasil ke `docs/lembar-uji-mandiri.md`**
  - Buat dokumen laporan pengujian mandiri lengkap dengan skenario, input yang diuji, respon yang diharapkan, respon aktual, dan status (PASS).

- [ ] **Step 4: Commit**
  - Commit: `git add firestore.rules docs/lembar-uji-mandiri.md && git commit -m "feat: add firestore security rules and self-test verification sheet"`

---

### Task 8: Konfigurasi Deployment Netlify & Verifikasi Akhir

**Files:**
- Create: `netlify.toml`
- Modify: `README.md`

**Interfaces:**
- Produces:
  - `netlify.toml`: Pengaturan build dan routing Netlify Single Page Application.
  - `README.md`: Panduan instalasi, konfigurasi environment variables, dan link demo/pengumpulan.

- [ ] **Step 1: Buat `netlify.toml`**
  - Konfigurasi build:
    ```toml
    [build]
      command = "npm run build"
      publish = "dist"

    [[redirects]]
      from = "/*"
      to = "/index.html"
      status = 200
    ```

- [ ] **Step 2: Buat Dokumentasi Lengkap di `README.md`**
  - Judul: Karsa Tiket (Tiketing Event) - Tugas Mandiri Sesi 3.
  - Fitur utama & tangkapan layar / arsitektur.
  - Petunjuk menjalankan secara lokal (`npm run dev`).
  - Petunjuk konfigurasi Firebase Environment Variables di Netlify.
  - Lembar checklist 8 Kriteria Selesai dari Tugas Mandiri.

- [ ] **Step 3: Jalankan Production Build Verification**
  - Jalankan `npm run build`
  - Verifikasi: bundle `dist/` terbentuk bersih tanpa error.

- [ ] **Step 4: Final Commit & Git Tag**
  - Commit: `git add . && git commit -m "chore: configure netlify build and add comprehensive documentation"`
