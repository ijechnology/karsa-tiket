import React from 'react';

export default function PembeliCard({ pembeli, onEdit, onDelete }) {
  const waLink = `https://wa.me/${pembeli.no_whatsapp.replace(/^0/, '62')}`;
  
  // Calculate 2-letter initials for avatar badge
  const initials = pembeli.nama
    ? pembeli.nama
        .trim()
        .split(/\s+/)
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'PB';

  const menuId = `customer-menu-${pembeli.no_whatsapp}`;

  return (
    <article className="list-item" aria-labelledby={`pembeli-name-${pembeli.no_whatsapp}`}>
      <div className="customer-card-header">
        <div className="customer-avatar" aria-hidden="true">
          {initials}
        </div>
        <div className="customer-info">
          <h3 id={`pembeli-name-${pembeli.no_whatsapp}`} className="list-item-title" style={{ fontSize: '1rem' }}>
            {pembeli.nama}
          </h3>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFeatureSettings: '"tnum"' }}>
            ID WhatsApp: {pembeli.no_whatsapp}
          </span>
        </div>
      </div>

      <div className="list-item-meta" style={{ marginBottom: '12px' }}>
        <div className="meta-line">
          <svg className="meta-icon" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, fontFeatureSettings: '"tnum"' }}
          >
            {pembeli.no_whatsapp}
          </a>
        </div>
        <div className="meta-line">
          <svg className="meta-icon" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          <span>{pembeli.email}</span>
        </div>
      </div>

      <div className="action-bar">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary btn-sm"
          style={{ textDecoration: 'none', gap: '6px' }}
        >
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
          </svg>
          <span>Chat WA</span>
        </a>

        {/* Polaris-style Dropdown Action Menu */}
        <div>
          <s-button commandFor={menuId} aria-label={`Pilihan aksi ${pembeli.nama}`}>
            Aksi Pelanggan
          </s-button>
          <s-menu id={menuId} accessibilityLabel={`Customer actions for ${pembeli.nama}`}>
            <s-button icon="edit" onClick={() => onEdit(pembeli)}>
              Edit Pelanggan
            </s-button>
            <s-button icon="incoming" onClick={() => window.open(waLink, '_blank')}>
              Kirim Pesan WhatsApp
            </s-button>
            <s-button icon="delete" tone="critical" onClick={() => onDelete(pembeli)}>
              Hapus Pelanggan
            </s-button>
          </s-menu>
        </div>
      </div>
    </article>
  );
}
