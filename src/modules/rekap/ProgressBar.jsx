import React from 'react';

export default function ProgressBar({ current, total, percentage }) {
  const pct = Math.min(100, Math.max(0, percentage || 0));

  return (
    <div style={{ marginTop: '12px', marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
        <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Keterisian Kuota</span>
        <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
          {current} dari {total} kursi ({pct}%)
        </span>
      </div>
      <div
        style={{
          width: '100%',
          height: '10px',
          backgroundColor: 'var(--surface-active)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden'
        }}
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin="0"
        aria-valuemax={total}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            backgroundColor: pct >= 100 ? 'var(--color-danger)' : 'var(--color-primary)',
            borderRadius: 'var(--radius-full)',
            transition: 'width 400ms ease'
          }}
        />
      </div>
    </div>
  );
}
