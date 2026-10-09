import React, { useEffect } from 'react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (toast?.show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast?.show) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className="toast-container" role="status" aria-live="polite">
      <div className={`toast ${isSuccess ? 'toast-success' : 'toast-error'}`}>
        <span>{isSuccess ? '✅' : '❌'}</span>
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
