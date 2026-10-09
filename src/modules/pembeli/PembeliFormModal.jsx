import React, { useState, useEffect } from 'react';

export default function PembeliFormModal({ isOpen, pembeliToEdit, onClose, onSave }) {
  const [formData, setFormData] = useState({
    nama: '',
    no_whatsapp: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (pembeliToEdit) {
      setFormData({
        nama: pembeliToEdit.nama || '',
        no_whatsapp: pembeliToEdit.no_whatsapp || '',
        email: pembeliToEdit.email || ''
      });
    } else {
      setFormData({
        nama: '',
        no_whatsapp: '',
        email: ''
      });
    }
    setErrors({});
  }, [pembeliToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    const nama = formData.nama.trim();
    const noWA = formData.no_whatsapp.trim();
    const email = formData.email.trim();

    if (!nama) {
      errs.nama = 'Nama pembeli wajib diisi.';
    } else if (nama.length > 60) {
      errs.nama = 'Nama pembeli maksimal 60 karakter.';
    }

    if (!noWA) {
      errs.no_whatsapp = 'Nomor WhatsApp wajib diisi.';
    } else if (!/^08\d{8,11}$/.test(noWA)) {
      errs.no_whatsapp = 'Nomor WhatsApp harus diawali 08 (panjang 10 sampai 13 angka).';
    }

    if (!email) {
      errs.email = 'Email wajib diisi.';
    } else if (!email.includes('@')) {
      errs.email = 'Email harus mengandung tanda @.';
    } else if (email.length > 80) {
      errs.email = 'Email maksimal 80 karakter.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSave({
        nama: formData.nama.trim(),
        no_whatsapp: formData.no_whatsapp.trim(),
        email: formData.email.trim()
      });
      onClose();
    } catch (err) {
      setErrors((prev) => ({ ...prev, general: err.message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-pembeli-title">
      <div className="modal-sheet">
        <div className="modal-sheet-handle" aria-hidden="true" />
        <div className="modal-header">
          <h3 id="modal-pembeli-title" className="modal-title">
            {pembeliToEdit ? 'Ubah Kontak Pembeli' : 'Tambah Pembeli Baru'}
          </h3>
          <button className="btn-icon-close" onClick={onClose} aria-label="Tutup">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {errors.general && (
          <div style={{ padding: '8px 12px', background: '#FEF2F2', border: '1px solid #FCA5A5', color: 'var(--status-batal)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', marginBottom: '14px' }}>
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="pembeli-nama">Nama Lengkap</label>
            <input
              id="pembeli-nama"
              type="text"
              className={`form-input ${errors.nama ? 'has-error' : ''}`}
              placeholder="Contoh: Nadia Putri"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              maxLength={60}
            />
            {errors.nama && <p className="form-error-msg">{errors.nama}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="pembeli-wa">Nomor WhatsApp</label>
            <input
              id="pembeli-wa"
              type="tel"
              className={`form-input ${errors.no_whatsapp ? 'has-error' : ''}`}
              placeholder="0813xxxxxxxx"
              value={formData.no_whatsapp}
              onChange={(e) => setFormData({ ...formData, no_whatsapp: e.target.value.replace(/\D/g, '') })}
              disabled={Boolean(pembeliToEdit)}
              maxLength={13}
            />
            {pembeliToEdit && (
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Nomor WhatsApp adalah identitas dokumen dan tidak dapat diubah.
              </p>
            )}
            {errors.no_whatsapp && <p className="form-error-msg">{errors.no_whatsapp}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="pembeli-email">Alamat Email</label>
            <input
              id="pembeli-email"
              type="email"
              className={`form-input ${errors.email ? 'has-error' : ''}`}
              placeholder="contoh: nadia.putri@contoh.id"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              maxLength={80}
            />
            {errors.email && <p className="form-error-msg">{errors.email}</p>}
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '18px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose} disabled={isSubmitting}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : (pembeliToEdit ? 'Simpan Perubahan' : 'Simpan Pembeli')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
