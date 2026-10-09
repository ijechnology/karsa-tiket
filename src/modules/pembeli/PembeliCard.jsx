import React from 'react';

export default function PembeliCard({ pembeli, onEdit, onDelete }) {
  const waLink = `https://wa.me/${pembeli.no_whatsapp.replace(/^0/, '62')}`;

  return (
    <article className="card" aria-labelledby={`pembeli-name-${pembeli.no_whatsapp}`}>
      <div className="card-header">
        <h3 id={`pembeli-name-${pembeli.no_whatsapp}`} className="card-title">
          {pembeli.nama}
        </h3>
        <span className="badge badge-hadir">Terdaftar</span>
      </div>

      <div className="card-meta">
        <div className="meta-row">
          <span aria-hidden="true">📱</span>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}
          >
            {pembeli.no_whatsapp}
          </a>
        </div>
        <div className="meta-row">
          <span aria-hidden="true">✉️</span>
          <span>{pembeli.email}</span>
        </div>
      </div>

      <div className="action-row">
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => onEdit(pembeli)}
          aria-label={`Ubah data ${pembeli.nama}`}
        >
          ✏️ Ubah
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(pembeli)}
          aria-label={`Hapus pembeli ${pembeli.nama}`}
        >
          🗑️ Hapus
        </button>
      </div>
    </article>
  );
}
