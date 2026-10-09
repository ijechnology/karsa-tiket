import React, { useState, useEffect } from 'react';
import { eventService, pembeliService } from '../../services';
import { formatRupiah } from '../event/EventCard';

export default function TiketFormModal({ isOpen, onClose, onSave }) {
  const [events, setEvents] = useState([]);
  const [pembeliList, setPembeliList] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [selectedPembeliWA, setSelectedPembeliWA] = useState('');
  const [jumlahTiket, setJumlahTiket] = useState(1);
  const [errors, setErrors] = useState({});
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const loadOptions = async () => {
        setIsLoadingData(true);
        try {
          const [evts, pmb] = await Promise.all([
            eventService.getEvents(),
            pembeliService.getPembeli()
          ]);
          setEvents(evts);
          setPembeliList(pmb);
          if (evts.length > 0) setSelectedEventId(evts[0].id);
          if (pmb.length > 0) setSelectedPembeliWA(pmb[0].no_whatsapp);
        } catch (e) {
          setErrors({ general: 'Gagal memuat pilihan event atau pembeli.' });
        } finally {
          setIsLoadingData(false);
        }
      };
      loadOptions();
      setJumlahTiket(1);
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedEvent = events.find((e) => e.id === selectedEventId);
  const selectedPembeli = pembeliList.find((p) => p.no_whatsapp === selectedPembeliWA);

  const sisaKuota = selectedEvent
    ? Math.max(0, selectedEvent.kuota - (selectedEvent.tiket_terjual || 0))
    : 0;

  const maxBolehBeli = Math.min(5, sisaKuota);
  const hargaSatuan = selectedEvent ? selectedEvent.harga_tiket : 0;
  const totalHarga = hargaSatuan * jumlahTiket;

  const validate = () => {
    const errs = {};
    if (!selectedEventId) {
      errs.event = 'Pilih salah satu event.';
    } else if (sisaKuota <= 0) {
      errs.event = 'Kuota event ini sudah habis.';
    }

    if (!selectedPembeliWA) {
      errs.pembeli = 'Pilih salah satu pembeli terdaftar.';
    }

    const jml = parseInt(jumlahTiket, 10);
    if (isNaN(jml) || jml < 1 || jml > 5) {
      errs.jumlah = 'Jumlah tiket harus antara 1 sampai 5.';
    } else if (jml > sisaKuota) {
      errs.jumlah = `Jumlah tiket melebihi sisa kuota yang tersedia (${sisaKuota}).`;
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
        event_id: selectedEvent.id,
        nama_event: selectedEvent.nama,
        tanggal_event: selectedEvent.tanggal,
        pembeli_id: selectedPembeli.no_whatsapp,
        nama_pembeli: selectedPembeli.nama,
        harga_tiket: selectedEvent.harga_tiket,
        jumlah_tiket: parseInt(jumlahTiket, 10)
      });
      onClose();
    } catch (err) {
      setErrors((prev) => ({ ...prev, general: err.message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-tiket-title">
      <div className="modal-sheet">
        <div className="modal-header">
          <h3 id="modal-tiket-title" className="modal-title">Buat Tiket Baru</h3>
          <button className="btn-close" onClick={onClose} aria-label="Tutup formulir">✕</button>
        </div>

        {errors.general && (
          <div style={{ padding: '8px 12px', background: 'var(--status-batal-bg)', color: 'var(--color-danger)', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '12px' }}>
            {errors.general}
          </div>
        )}

        {isLoadingData ? (
          <p style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>Memuat pilihan event dan pembeli...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="tiket-event">Pilih Event *</label>
              <select
                id="tiket-event"
                className={`form-select ${errors.event ? 'has-error' : ''}`}
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
              >
                {events.map((evt) => {
                  const sisa = Math.max(0, evt.kuota - (evt.tiket_terjual || 0));
                  return (
                    <option key={evt.id} value={evt.id} disabled={sisa === 0}>
                      {evt.nama} — {formatRupiah(evt.harga_tiket)} ({sisa === 0 ? 'Habis' : `Sisa ${sisa}`})
                    </option>
                  );
                })}
              </select>
              {errors.event && <p className="form-error-text">{errors.event}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="tiket-pembeli">Pilih Pembeli *</label>
              <select
                id="tiket-pembeli"
                className={`form-select ${errors.pembeli ? 'has-error' : ''}`}
                value={selectedPembeliWA}
                onChange={(e) => setSelectedPembeliWA(e.target.value)}
              >
                {pembeliList.map((p) => (
                  <option key={p.no_whatsapp} value={p.no_whatsapp}>
                    {p.nama} ({p.no_whatsapp})
                  </option>
                ))}
              </select>
              {errors.pembeli && <p className="form-error-text">{errors.pembeli}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="tiket-jumlah">
                Jumlah Tiket (Maksimal 5) *
              </label>
              <input
                id="tiket-jumlah"
                type="number"
                min="1"
                max={Math.max(1, maxBolehBeli)}
                className={`form-input ${errors.jumlah ? 'has-error' : ''}`}
                value={jumlahTiket}
                onChange={(e) => setJumlahTiket(e.target.value)}
              />
              {errors.jumlah && <p className="form-error-text">{errors.jumlah}</p>}
            </div>

            {/* Kotak Ringkasan Perhitungan Total Otomatis */}
            <div style={{ background: 'var(--surface-subtle)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span>Harga Satuan:</span>
                <span style={{ fontWeight: 600 }}>{formatRupiah(hargaSatuan)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span>Jumlah:</span>
                <span style={{ fontWeight: 600 }}>{jumlahTiket} tiket</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 700, borderTop: '1px solid var(--border-light)', paddingTop: '6px', color: 'var(--color-primary)' }}>
                <span>Total Pembayaran:</span>
                <span>{formatRupiah(totalHarga)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
                Batal
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting || sisaKuota <= 0}
              >
                {isSubmitting ? 'Menerbitkan...' : 'Simpan Tiket'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
