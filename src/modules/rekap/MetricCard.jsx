import React from 'react';

export default function MetricCard({ title, value, subtitle, highlight = false, iconType }) {
  const renderIcon = () => {
    switch (iconType) {
      case 'ticket':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
            <path d="M13 5v2" />
            <path d="M13 17v2" />
            <path d="M13 11v2" />
          </svg>
        );
      case 'chair':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 9h-4V5a3 3 0 0 0-6 0v4H5a2 2 0 0 0-2 2v7h18v-7a2 2 0 0 0-2-2Z" />
            <path d="M6 18v3" />
            <path d="M18 18v3" />
          </svg>
        );
      case 'wallet':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" />
          </svg>
        );
      case 'check':
      default:
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <polyline points="16 11 18 13 22 9" />
          </svg>
        );
    }
  };

  return (
    <div
      style={{
        backgroundColor: highlight ? 'var(--primary-subtle)' : 'var(--bg-surface)',
        border: `1px solid ${highlight ? 'var(--primary-border)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: highlight
          ? '0 4px 14px -2px rgba(15, 118, 110, 0.12)'
          : '0 1px 3px rgba(15, 23, 42, 0.04)',
        transition: 'transform var(--ease-standard), border-color var(--ease-standard)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {title}
        </span>
        <span style={{ color: highlight ? 'var(--primary)' : 'var(--text-muted)' }}>
          {renderIcon()}
        </span>
      </div>
      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: highlight ? 'var(--primary-active)' : 'var(--text-primary)', fontFeatureSettings: '"tnum"', lineHeight: 1.15 }}>
        {value}
      </div>
      {subtitle && (
        <div style={{ fontSize: '0.7rem', color: highlight ? 'var(--primary)' : 'var(--text-muted)', marginTop: '6px' }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}
