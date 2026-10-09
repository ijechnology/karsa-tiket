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
    <article className="card" aria-labelledby={`event-title-${event.id}`}>
      <div className="card-header">
        <h3 id={`event-title-${event.id}`} className="card-title">
          {event.nama}
        </h3>
        {isHabis ? (
          <span className="badge badge-habis">Habis</span>
        ) : (
          <span className="badge badge-lunas">Sisa {sisaKuota}</span>
        )}
      </div>

      <div className="card-meta">
        <div className="meta-row">
          <span aria-hidden="true">📅</span>
          <span>{formatTanggalIndo(event.tanggal)}</span>
        </div>
        <div className="meta-row">
          <span aria-hidden="true">📍</span>
          <span>{event.lokasi}</span>
        </div>
        <div className="meta-row">
          <span aria-hidden="true">🏷️</span>
          <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
            {formatRupiah(event.harga_tiket)}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>• Kuota: {event.kuota}</span>
        </div>
      </div>

      <div className="action-row">
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => onEdit(event)}
          aria-label={`Ubah event ${event.nama}`}
        >
          ✏️ Ubah
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(event)}
          aria-label={`Hapus event ${event.nama}`}
        >
          🗑️ Hapus
        </button>
      </div>
    </article>
  );
}
