import React from 'react';

export default function PembeliCard({ pembeli, onEdit, onDelete }) {
  const waLink = `https://wa.me/${pembeli.no_whatsapp.replace(/^0/, '62')}`;

  return (
    <article className="list-item" aria-labelledby={`pembeli-name-${pembeli.no_whatsapp}`}>
      <div className="list-item-header">
        <h3 id={`pembeli-name-${pembeli.no_whatsapp}`} className="list-item-title">
          {pembeli.nama}
        </h3>
        <span className="status-pill">
          <span className="status-dot hadir" aria-hidden="true" />
          <span>Terverifikasi</span>
        </span>
      </div>

      <div className="list-item-meta">
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
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          ID: {pembeli.no_whatsapp}
        </span>
        <div className="btn-group">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onEdit(pembeli)}
            aria-label={`Ubah data ${pembeli.nama}`}
          >
            Ubah
          </button>
          <button
            className="btn btn-danger-outline btn-sm"
            onClick={() => onDelete(pembeli)}
            aria-label={`Hapus pembeli ${pembeli.nama}`}
          >
            Hapus
          </button>
        </div>
      </div>
    </article>
  );
}
