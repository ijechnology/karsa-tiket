import React from 'react';
import { formatRupiah, formatTanggalIndo } from '../event/EventCard';

export default function TiketCard({
  tiket,
  onUpdateStatus,
  onCancelTiket,
  onDelete
}) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'lunas':
        return (
          <span className="status-pill">
            <span className="status-dot lunas" aria-hidden="true" />
            <span>Lunas</span>
          </span>
        );
      case 'hadir':
        return (
          <span className="status-pill">
            <span className="status-dot hadir" aria-hidden="true" />
            <span>Hadir</span>
          </span>
        );
      case 'dibatalkan':
        return (
          <span className="status-pill">
            <span className="status-dot batal" aria-hidden="true" />
            <span>Dibatalkan</span>
          </span>
        );
      case 'menunggu_bayar':
      default:
        return (
          <span className="status-pill">
            <span className="status-dot menunggu" aria-hidden="true" />
            <span>Menunggu Bayar</span>
          </span>
        );
    }
  };

  return (
    <article className="list-item" aria-labelledby={`tiket-title-${tiket.id}`}>
      <div className="list-item-header">
        <div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFeatureSettings: '"tnum"' }}>
            #{tiket.id}
          </span>
          <h3 id={`tiket-title-${tiket.id}`} className="list-item-title">
            {tiket.nama_event}
          </h3>
        </div>
        {getStatusBadge(tiket.status)}
      </div>

      <div className="list-item-meta">
        <div className="meta-line">
          <svg className="meta-icon" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span style={{ fontWeight: 600 }}>{tiket.nama_pembeli}</span>
          <span style={{ color: 'var(--text-muted)', fontFeatureSettings: '"tnum"' }}>({tiket.pembeli_id})</span>
        </div>
        <div className="meta-line">
          <svg className="meta-icon" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>{formatTanggalIndo(tiket.tanggal_event)}</span>
        </div>
        <div className="meta-line" style={{ marginTop: '2px', justifyContent: 'space-between' }}>
          <span>{tiket.jumlah_tiket} tiket × {formatRupiah(tiket.harga_tiket)}</span>
          <span className="price-tag" style={{ color: 'var(--primary)' }}>
            Total: {formatRupiah(tiket.total)}
          </span>
        </div>
      </div>

      <div className="action-bar">
        <button
          className="btn btn-danger-outline btn-sm"
          onClick={() => onDelete(tiket)}
          aria-label={`Hapus tiket ${tiket.id}`}
        >
          Hapus
        </button>

        <div className="btn-group">
          {tiket.status === 'menunggu_bayar' && (
            <>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onCancelTiket(tiket)}
              >
                Batalkan
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => onUpdateStatus(tiket.id, tiket.status, 'lunas')}
              >
                Konfirmasi Lunas
              </button>
            </>
          )}

          {tiket.status === 'lunas' && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onUpdateStatus(tiket.id, tiket.status, 'hadir')}
            >
              Check-in Hadir
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
