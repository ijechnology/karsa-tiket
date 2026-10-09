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
          <span className="badge-contrast lunas">
            <span className="status-dot lunas" aria-hidden="true" />
            <span>Lunas</span>
          </span>
        );
      case 'hadir':
        return (
          <span className="badge-contrast hadir">
            <span className="status-dot hadir" aria-hidden="true" />
            <span>Hadir</span>
          </span>
        );
      case 'dibatalkan':
        return (
          <span className="badge-contrast batal">
            <span className="status-dot batal" aria-hidden="true" />
            <span>Dibatalkan</span>
          </span>
        );
      case 'menunggu_bayar':
      default:
        return (
          <span className="badge-contrast menunggu">
            <span className="status-dot menunggu" aria-hidden="true" />
            <span>Menunggu Bayar</span>
          </span>
        );
    }
  };

  const menuId = `tiket-menu-${tiket.id}`;
  const shortId = tiket.id ? String(tiket.id).slice(-6).toUpperCase() : '000000';

  return (
    <article className="ticket-pass" aria-labelledby={`tiket-title-${tiket.id}`}>
      {/* Ticket Header & Serial */}
      <div className="list-item-header">
        <div>
          <span className="serial-badge" style={{ marginBottom: '4px' }}>
            #TKT-{shortId}
          </span>
          <h3 id={`tiket-title-${tiket.id}`} className="list-item-title" style={{ fontSize: '1rem', marginTop: '2px' }}>
            {tiket.nama_event}
          </h3>
        </div>
        {getStatusBadge(tiket.status)}
      </div>

      <div className="list-item-meta" style={{ marginBottom: '8px' }}>
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
      </div>

      {/* Authentic Ticket Stub Perforation with Punch-hole Notches */}
      <div className="ticket-stub-perforation">
        <span className="ticket-notch-left" aria-hidden="true" />
        <span className="ticket-notch-right" aria-hidden="true" />
      </div>

      {/* Ticket Pricing & Quantity Bento Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', fontSize: '0.82rem' }}>
        <div>
          <span style={{ color: 'var(--text-secondary)' }}>
            <strong>{tiket.jumlah_tiket}</strong> tiket × {formatRupiah(tiket.harga_tiket)}
          </span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span className="price-tag" style={{ color: 'var(--primary)', fontSize: '0.95rem' }}>
            {formatRupiah(tiket.total)}
          </span>
        </div>
      </div>

      {/* Action Bar with Quick CTA and Polaris Dropdown Menu */}
      <div className="action-bar">
        <div className="btn-group">
          {tiket.status === 'menunggu_bayar' && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onUpdateStatus(tiket.id, tiket.status, 'lunas')}
            >
              Konfirmasi Lunas
            </button>
          )}

          {tiket.status === 'lunas' && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onUpdateStatus(tiket.id, tiket.status, 'hadir')}
            >
              Check-in Hadir
            </button>
          )}

          {tiket.status === 'hadir' && (
            <span style={{ fontSize: '0.74rem', color: 'var(--primary)', fontWeight: 600 }}>
              Peserta Sudah Hadir
            </span>
          )}

          {tiket.status === 'dibatalkan' && (
            <span style={{ fontSize: '0.74rem', color: 'var(--status-batal)', fontWeight: 500 }}>
              Pesanan Telah Dibatalkan
            </span>
          )}
        </div>

        {/* Polaris-style Dropdown Action Menu */}
        <div>
          <s-button commandFor={menuId} aria-label={`Pilihan aksi tiket #${shortId}`}>
            Aksi Tiket
          </s-button>
          <s-menu id={menuId} accessibilityLabel={`Pilihan aksi tiket #${shortId}`}>
            {tiket.status === 'menunggu_bayar' && (
              <>
                <s-button icon="check" onClick={() => onUpdateStatus(tiket.id, tiket.status, 'lunas')}>
                  Konfirmasi Lunas
                </s-button>
                <s-button icon="cancel" tone="critical" onClick={() => onCancelTiket(tiket)}>
                  Batalkan Pesanan
                </s-button>
              </>
            )}

            {tiket.status === 'lunas' && (
              <s-button icon="incoming" onClick={() => onUpdateStatus(tiket.id, tiket.status, 'hadir')}>
                Check-in Hadir
              </s-button>
            )}

            <s-button icon="delete" tone="critical" onClick={() => onDelete(tiket)}>
              Hapus Tiket
            </s-button>
          </s-menu>
        </div>
      </div>
    </article>
  );
}
