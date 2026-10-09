import React from 'react';

export function formatRupiah(amount) {
  if (amount === 0) return 'Gratis';
  return 'Rp ' + Number(amount).toLocaleString('id-ID');
}

export function formatTanggalIndo(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const year = parts[0];
  const month = months[parseInt(parts[1], 10) - 1] || parts[1];
  const day = parseInt(parts[2], 10);
  return `${day} ${month} ${year}`;
}

export default function EventCard({ event, onEdit, onDelete }) {
  const sisaKuota = Math.max(0, event.kuota - (event.tiket_terjual || 0));
  const isHabis = sisaKuota === 0;

  return (
    <article className="list-item" aria-labelledby={`event-title-${event.id}`}>
      <div className="list-item-header">
        <h3 id={`event-title-${event.id}`} className="list-item-title">
          {event.nama}
        </h3>
        <span className="status-pill">
          <span className={`status-dot ${isHabis ? 'habis' : 'lunas'}`} aria-hidden="true" />
          <span>{isHabis ? 'Habis' : `Tersedia ${sisaKuota}`}</span>
        </span>
      </div>

      <div className="list-item-meta">
        <div className="meta-line">
          <svg className="meta-icon" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>{formatTanggalIndo(event.tanggal)}</span>
        </div>
        <div className="meta-line">
          <svg className="meta-icon" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{event.lokasi}</span>
        </div>
        <div className="meta-line" style={{ marginTop: '2px' }}>
          <span className="price-tag">{formatRupiah(event.harga_tiket)}</span>
          <span style={{ color: 'var(--text-muted)' }}>• Kuota {event.kuota} kursi</span>
        </div>
      </div>

      <div className="action-bar">
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFeatureSettings: '"tnum"' }}>
          Terjual: {event.tiket_terjual || 0}
        </span>
        <div className="btn-group">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onEdit(event)}
            aria-label={`Ubah event ${event.nama}`}
          >
            Ubah
          </button>
          <button
            className="btn btn-danger-outline btn-sm"
            onClick={() => onDelete(event)}
            aria-label={`Hapus event ${event.nama}`}
          >
            Hapus
          </button>
        </div>
      </div>
    </article>
  );
}
