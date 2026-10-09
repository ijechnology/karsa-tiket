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
      <div className="skeleton-container" aria-busy="true" aria-label="Memuat data">
        <div className="skeleton-card">
          <div className="skeleton-line skeleton-title"></div>
          <div className="skeleton-line" style={{ width: '80%' }}></div>
          <div className="skeleton-line" style={{ width: '50%' }}></div>
        </div>
        <div className="skeleton-card">
          <div className="skeleton-line skeleton-title"></div>
          <div className="skeleton-line" style={{ width: '75%' }}></div>
          <div className="skeleton-line" style={{ width: '45%' }}></div>
        </div>
      </div>
    );
  }

  if (state === 'empty') {
    return (
      <div className="state-container">
        <div className="state-icon" aria-hidden="true">📭</div>
        <h3 className="state-title">{emptyTitle}</h3>
        <p className="state-desc">{emptyDesc}</p>
        {actionLabel && onAction && (
          <button className="btn btn-primary" onClick={onAction}>
            {actionLabel}
          </button>
        )}
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="state-container">
        <div className="state-icon" aria-hidden="true">⚠️</div>
        <h3 className="state-title">{errorTitle}</h3>
        <p className="state-desc">{errorDesc}</p>
        {onRetry && (
          <button className="btn btn-secondary" onClick={onRetry}>
            🔄 Coba Lagi
          </button>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
