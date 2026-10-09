import React from 'react';

export default function ProgressBar({ current, total, percentage }) {
  const pct = Math.min(100, Math.max(0, percentage || 0));

  return (
    <div style={{ marginTop: '14px', marginBottom: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '8px' }}>
        <span style={{ color: 'var(--text-secondary)' }}>Keterisian Kuota</span>
        <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontFeatureSettings: '"tnum"' }}>
          {current} / {total} kursi ({pct}%)
        </span>
      </div>
      <div
        style={{
          width: '100%',
          height: '6px',
          backgroundColor: 'var(--bg-hover)',
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
            backgroundColor: pct >= 100 ? 'var(--status-batal)' : 'var(--primary)',
            borderRadius: 'var(--radius-full)',
            transition: 'width 300ms ease'
          }}
        />
      </div>
    </div>
  );
}
