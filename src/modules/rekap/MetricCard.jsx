import React from 'react';

export default function MetricCard({ icon, title, value, subtitle, highlight = false }) {
  return (
    <div
      className="card"
      style={{
        padding: '14px',
        marginBottom: '0',
        backgroundColor: highlight ? 'var(--color-primary-light)' : 'var(--surface-card)',
        borderColor: highlight ? 'var(--color-primary)' : 'var(--border-light)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          {title}
        </span>
        <span style={{ fontSize: '1.2rem' }} aria-hidden="true">{icon}</span>
      </div>
      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: highlight ? 'var(--color-primary-dark)' : 'var(--text-main)', lineHeight: 1.2 }}>
        {value}
      </div>
      {subtitle && (
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}
