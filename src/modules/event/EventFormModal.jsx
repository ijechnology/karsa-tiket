import React, { useState, useEffect } from 'react';

export default function EventFormModal({ isOpen, eventToEdit, onClose, onSave }) {
  const [formData, setFormData] = useState({
    nama: '',
    tanggal: '',
    lokasi: '',
    harga_tiket: '',
    kuota: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (eventToEdit) {
      setFormData({
        nama: eventToEdit.nama || '',
        tanggal: eventToEdit.tanggal || '',
        lokasi: eventToEdit.lokasi || '',
        harga_tiket: eventToEdit.harga_tiket !== undefined ? eventToEdit.harga_tiket : '',
        kuota: eventToEdit.kuota !== undefined ? eventToEdit.kuota : ''
      });
    } else {
      setFormData({
        nama: '',
        tanggal: '',
        lokasi: '',
        harga_tiket: '',
        kuota: ''
      });
    }
    setErrors({});
  }, [eventToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.nama.trim()) {
      errs.nama = 'Nama event wajib diisi.';
    } else if (formData.nama.length > 60) {
      errs.nama = 'Nama event maksimal 60 karakter.';
    }

    if (!formData.tanggal) {
      errs.tanggal = 'Tanggal event wajib dipilih.';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.tanggal)) {
      errs.tanggal = 'Format tanggal harus YYYY-MM-DD.';
    }

    if (!formData.lokasi.trim()) {
      errs.lokasi = 'Lokasi event wajib diisi.';
    } else if (formData.lokasi.length > 100) {
      errs.lokasi = 'Lokasi maksimal 100 karakter.';
    }

    const harga = parseInt(formData.harga_tiket, 10);
    if (formData.harga_tiket === '' || isNaN(harga) || harga < 0) {
      errs.harga_tiket = 'Harga tiket minimal Rp 0 (0 = gratis).';
    }

    const kuota = parseInt(formData.kuota, 10);
    if (formData.kuota === '' || isNaN(kuota) || kuota < 1 || kuota > 500) {
      errs.kuota = 'Kuota harus berupa angka antara 1 sampai 500.';
    } else if (eventToEdit && kuota < (eventToEdit.tiket_terjual || 0)) {
      errs.kuota = `Kuota tidak boleh lebih kecil dari tiket terjual (${eventToEdit.tiket_terjual}).`;
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
        ...formData,
        harga_tiket: parseInt(formData.harga_tiket, 10),
        kuota: parseInt(formData.kuota, 10)
      });
      onClose();
    } catch (err) {
      setErrors((prev) => ({ ...prev, general: err.message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-event-title">
      <div className="modal-sheet">
        <div className="modal-sheet-handle" aria-hidden="true" />
        <div className="modal-header">
          <h3 id="modal-event-title" className="modal-title">
            {eventToEdit ? 'Ubah Informasi Event' : 'Tambah Event Baru'}
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
            <label className="form-label" htmlFor="event-nama">Nama Event</label>
            <input
              id="event-nama"
              type="text"
              className={`form-input ${errors.nama ? 'has-error' : ''}`}
              placeholder="Contoh: Workshop Sablon Tote Bag"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              maxLength={60}
            />
            {errors.nama && <p className="form-error-msg">{errors.nama}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="event-tanggal">Tanggal Pelaksanaan</label>
            <input
              id="event-tanggal"
              type="date"
              className={`form-input ${errors.tanggal ? 'has-error' : ''}`}
              value={formData.tanggal}
              onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
            />
            {errors.tanggal && <p className="form-error-msg">{errors.tanggal}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="event-lokasi">Lokasi Acara</label>
            <input
              id="event-lokasi"
              type="text"
              className={`form-input ${errors.lokasi ? 'has-error' : ''}`}
              placeholder="Contoh: Ruang Karsa, Jl. Merdeka No. 21"
              value={formData.lokasi}
              onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
              maxLength={100}
            />
            {errors.lokasi && <p className="form-error-msg">{errors.lokasi}</p>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="event-harga">Harga Tiket (Rp)</label>
              <input
                id="event-harga"
                type="number"
                min="0"
                className={`form-input ${errors.harga_tiket ? 'has-error' : ''}`}
                placeholder="0 untuk gratis"
                value={formData.harga_tiket}
                onChange={(e) => setFormData({ ...formData, harga_tiket: e.target.value })}
              />
              {errors.harga_tiket && <p className="form-error-msg">{errors.harga_tiket}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="event-kuota">Kapasitas Kursi</label>
              <input
                id="event-kuota"
                type="number"
                min="1"
                max="500"
                className={`form-input ${errors.kuota ? 'has-error' : ''}`}
                placeholder="1 - 500"
                value={formData.kuota}
                onChange={(e) => setFormData({ ...formData, kuota: e.target.value })}
              />
              {errors.kuota && <p className="form-error-msg">{errors.kuota}</p>}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '18px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose} disabled={isSubmitting}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : (eventToEdit ? 'Simpan Perubahan' : 'Simpan Event')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
