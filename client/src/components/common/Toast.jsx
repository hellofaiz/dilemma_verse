/**
 * Toast – notification system
 */

import React from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

const icons = {
  success: <CheckCircle2 size={17} color="var(--success)" />,
  error:   <XCircle     size={17} color="var(--danger)"  />,
  info:    <Info        size={17} color="var(--accent)"  />,
};

export default function Toast({ toasts, onRemove }) {
  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast toast-${toast.type}`} role="alert">
          {icons[toast.type] || icons.info}
          <span className="toast-message">{toast.message}</span>
          <button
            className="btn btn-icon btn-sm btn-secondary"
            onClick={() => onRemove(toast.id)}
            aria-label="Dismiss"
            style={{ padding: '4px', minWidth: 26 }}
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}
