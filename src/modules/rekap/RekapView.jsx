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
      <div className="section-header">
        <div>
          <h2 className="section-title">Rekapitulasi</h2>
          <p className="section-subtitle">Ringkasan pendapatan, kapasitas, dan kehadiran peserta</p>
        </div>
      </div>

      <StateView
        state={state}
        emptyTitle="Belum Ada Acara"
        emptyDesc="Tambahkan acara terlebih dahulu pada menu Event untuk melihat ringkasan performa."
        errorTitle="Gagal Memuat Rekap"
        errorDesc="Terjadi kendala saat membaca data rekapitulasi."
        onRetry={() => loadData(false)}
      >
        {rekap && (
          <div>
            {/* Event Selector */}
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" htmlFor="select-rekap-event">Pilih Acara</label>
              <select
                id="select-rekap-event"
                className="form-select"
                value={selectedEventId}
                onChange={handleSelectEvent}
              >
                {events.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    {evt.nama} — {formatTanggalIndo(evt.tanggal)}
                  </option>
                ))}
              </select>
            </div>

            {/* Event Summary Overview */}
            <div className="list-item" style={{ marginBottom: '14px' }}>
              <h3 className="list-item-title" style={{ fontSize: '1.05rem', marginBottom: '6px' }}>
                {rekap.event.nama}
              </h3>
              <div className="list-item-meta" style={{ marginBottom: '10px' }}>
                <div className="meta-line">
                  <svg className="meta-icon" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>{rekap.event.lokasi}</span>
                </div>
                <div className="meta-line">
                  <span style={{ color: 'var(--text-muted)' }}>Tarif:</span>
                  <span className="price-tag">{formatRupiah(rekap.event.harga_tiket)}</span>
                </div>
              </div>

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
                title="Tiket Terjual"
                value={`${rekap.tiket_terjual} / ${rekap.event.kuota}`}
                subtitle="Kapasitas kursi terisi"
              />
              <MetricCard
                title="Sisa Kuota"
                value={`${rekap.sisa_kuota}`}
                subtitle="Kursi masih tersedia"
              />
              <MetricCard
                title="Pendapatan"
                value={formatRupiah(rekap.pendapatan)}
                subtitle="Tiket lunas & hadir"
                highlight={true}
              />
              <MetricCard
                title="Kehadiran"
                value={`${rekap.jumlah_hadir}`}
                subtitle="Peserta terverifikasi"
              />
            </div>

            {/* Informasi Akuntansi */}
            <div style={{ padding: '12px 14px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Ketentuan PRD: Transaksi berstatus <em>Menunggu Bayar</em> dan <em>Dibatalkan</em> tidak dihitung dalam akumulasi pendapatan.
            </div>
          </div>
        )}
      </StateView>
    </div>
  );
}
