import React, { useState, useEffect } from 'react';
import { eventService, rekapService } from '../../services';
import MetricCard from './MetricCard';
import ProgressBar from './ProgressBar';
import StateView from '../../components/common/StateView';
import { formatRupiah, formatTanggalIndo } from '../event/EventCard';

export default function RekapView() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [rekap, setRekap] = useState(null);
  const [state, setState] = useState('loading'); // 'loading' | 'empty' | 'error' | 'idle'

  const loadData = async (forceError = false) => {
    setState('loading');
    try {
      const evts = await eventService.getEvents(forceError);
      setEvents(evts);
      if (evts.length === 0) {
        setState('empty');
        return;
      }

      const activeId = selectedEventId && evts.some((e) => e.id === selectedEventId)
        ? selectedEventId
        : evts[0].id;

      setSelectedEventId(activeId);
      const data = await rekapService.getRekapByEvent(activeId, forceError);
      setRekap(data);
      setState('idle');
    } catch (err) {
      setState('error');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectEvent = async (e) => {
    const newId = e.target.value;
    setSelectedEventId(newId);
    setState('loading');
    try {
      const data = await rekapService.getRekapByEvent(newId);
      setRekap(data);
      setState('idle');
    } catch (err) {
      setState('error');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '14px' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>Rekap Penjualan</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Ringkasan pendapatan, kuota, dan kehadiran per event</p>
      </div>

      <StateView
        state={state}
        emptyTitle="Belum Ada Event untuk Direkap"
        emptyDesc="Tambahkan event terlebih dahulu di menu Event untuk melihat rekapitulasi penjualan."
        errorTitle="Gagal Memuat Rekap"
        errorDesc="Terjadi kendala saat membaca data rekapitulasi."
        onRetry={() => loadData(false)}
      >
        {rekap && (
          <div>
            {/* Event Selector Dropdown */}
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" htmlFor="select-rekap-event">Pilih Event:</label>
              <select
                id="select-rekap-event"
                className="form-select"
                value={selectedEventId}
                onChange={handleSelectEvent}
              >
                {events.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    {evt.nama} ({formatTanggalIndo(evt.tanggal)})
                  </option>
                ))}
              </select>
            </div>

            {/* Event Summary Banner */}
            <div className="card" style={{ backgroundColor: 'var(--surface-subtle)', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                {rekap.event.nama}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                📍 {rekap.event.lokasi}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                🏷️ Harga Tiket: <strong style={{ color: 'var(--color-primary)' }}>{formatRupiah(rekap.event.harga_tiket)}</strong>
              </p>

              {/* Progress Bar Keterisian Kursi */}
              <ProgressBar
                current={rekap.tiket_terjual}
                total={rekap.event.kuota}
                percentage={rekap.persentase}
              />
            </div>

            {/* 4 Kuadran Metrik Angka */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              <MetricCard
                icon="🎟️"
                title="Tiket Terjual"
                value={`${rekap.tiket_terjual} / ${rekap.event.kuota}`}
                subtitle="Kursi terisi"
              />
              <MetricCard
                icon="🪑"
                title="Sisa Kuota"
                value={`${rekap.sisa_kuota}`}
                subtitle="Kursi tersedia"
              />
              <MetricCard
                icon="💰"
                title="Pendapatan"
                value={formatRupiah(rekap.pendapatan)}
                subtitle="Dari tiket Lunas & Hadir"
                highlight={true}
              />
              <MetricCard
                icon="👥"
                title="Jumlah Hadir"
                value={`${rekap.jumlah_hadir} orang`}
                subtitle="Peserta check-in"
              />
            </div>

            {/* Informasi Validitas Data */}
            <div style={{ padding: '10px 14px', background: '#FFFFFF', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              ℹ️ <strong>Catatan:</strong> Sesuai PRD, tiket dengan status <em>Menunggu Bayar</em> dan <em>Dibatalkan</em> tidak dimasukkan ke dalam perhitungan Pendapatan.
            </div>
          </div>
        )}
      </StateView>
    </div>
  );
}
