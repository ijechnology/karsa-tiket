import React from 'react';

export default function MetricCard({ title, value, subtitle, highlight = false }) {
  return (
    <div
      style={{
        backgroundColor: highlight ? 'var(--primary-subtle)' : 'var(--bg-surface)',
        border: `1px solid ${highlight ? 'var(--primary-border)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
        {title}
      </div>
      <div style={{ fontSize: '1.35rem', fontWeight: 700, color: highlight ? 'var(--primary-active)' : 'var(--text-primary)', fontFeatureSettings: '"tnum"', lineHeight: 1.1 }}>
        {value}
      </div>
      {subtitle && (
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px' }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}
