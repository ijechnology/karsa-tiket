import React from 'react';

export default function StateView({
  state = 'idle', // 'loading' | 'empty' | 'error' | 'idle'
  emptyTitle = 'Belum Ada Data',
  emptyDesc = 'Data belum tersedia saat ini.',
  actionLabel,
  onAction,
  errorTitle = 'Gagal Memuat Data',
  errorDesc = 'Terjadi kendala saat mengambil data. Silakan coba lagi.',
  onRetry,
  children
}) {
  if (state === 'loading') {
    return (
      <div aria-busy="true" aria-label="Memuat data">
        <div className="skeleton-row">
          <div className="skeleton-bar" style={{ width: '50%', height: '14px', marginBottom: '12px' }} />
          <div className="skeleton-bar" style={{ width: '80%' }} />
          <div className="skeleton-bar" style={{ width: '40%' }} />
        </div>
        <div className="skeleton-row">
          <div className="skeleton-bar" style={{ width: '60%', height: '14px', marginBottom: '12px' }} />
          <div className="skeleton-bar" style={{ width: '75%' }} />
          <div className="skeleton-bar" style={{ width: '35%' }} />
        </div>
      </div>
    );
  }

  if (state === 'empty') {
    return (
      <div className="state-box">
        <svg className="state-svg-icon" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
        <h3 className="state-heading">{emptyTitle}</h3>
        <p className="state-subtext">{emptyDesc}</p>
        {actionLabel && onAction && (
          <button className="btn btn-primary btn-sm" onClick={onAction}>
            {actionLabel}
          </button>
        )}
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="state-box">
        <svg className="state-svg-icon" viewBox="0 0 24 24" fill="none" stroke="var(--status-batal)" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <h3 className="state-heading">{errorTitle}</h3>
        <p className="state-subtext">{errorDesc}</p>
        {onRetry && (
          <button className="btn btn-secondary btn-sm" onClick={onRetry}>
            Coba Lagi
          </button>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
