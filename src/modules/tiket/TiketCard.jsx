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
        return <span className="badge badge-lunas">Lunas</span>;
      case 'hadir':
        return <span className="badge badge-hadir">Hadir (Check-in)</span>;
      case 'dibatalkan':
        return <span className="badge badge-batal">Dibatalkan</span>;
      case 'menunggu_bayar':
      default:
        return <span className="badge badge-menunggu">Menunggu Bayar</span>;
    }
  };

  return (
    <article className="card" aria-labelledby={`tiket-title-${tiket.id}`}>
      <div className="card-header">
        <div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
            #{tiket.id}
          </span>
          <h3 id={`tiket-title-${tiket.id}`} className="card-title">
            {tiket.nama_event}
          </h3>
        </div>
        {getStatusBadge(tiket.status)}
      </div>

      <div className="card-meta">
        <div className="meta-row">
          <span aria-hidden="true">👤</span>
          <span style={{ fontWeight: 600 }}>{tiket.nama_pembeli}</span>
          <span style={{ color: 'var(--text-muted)' }}>({tiket.pembeli_id})</span>
        </div>
        <div className="meta-row">
          <span aria-hidden="true">📅</span>
          <span>{formatTanggalIndo(tiket.tanggal_event)}</span>
        </div>
        <div className="meta-row">
          <span aria-hidden="true">🎟️</span>
          <span>{tiket.jumlah_tiket} Tiket × {formatRupiah(tiket.harga_tiket)}</span>
          <span style={{ fontWeight: 700, color: 'var(--color-primary)', marginLeft: 'auto' }}>
            Total: {formatRupiah(tiket.total)}
          </span>
        </div>
      </div>

      <div className="action-row" style={{ justifyContent: 'space-between' }}>
        <div>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(tiket)}
            aria-label={`Hapus tiket ${tiket.id}`}
          >
            🗑️ Hapus
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {tiket.status === 'menunggu_bayar' && (
            <>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => onCancelTiket(tiket)}
              >
                Batalkan
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => onUpdateStatus(tiket.id, tiket.status, 'lunas')}
              >
                ✓ Konfirmasi Lunas
              </button>
            </>
          )}

          {tiket.status === 'lunas' && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onUpdateStatus(tiket.id, tiket.status, 'hadir')}
            >
              🎟️ Check-in Hadir
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
