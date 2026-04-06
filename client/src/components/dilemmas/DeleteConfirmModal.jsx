/**
 * DeleteConfirmModal – confirm before deleting a dilemma
 */

import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, dilemma, onClose, onConfirm }) {
  if (!isOpen || !dilemma) return null;

  const handleConfirm = () => {
    onConfirm(dilemma.id);
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Confirm delete"
      onClick={onClose}
    >
      <div className="modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Delete Dilemma</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
          <div className="delete-confirm-icon">
            <AlertTriangle size={26} />
          </div>
          <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '1rem', marginBottom: 8 }}>
            Are you sure?
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5 }}>
            You're about to delete{' '}
            <strong style={{ color: 'var(--text-primary)' }}>"{dilemma.situation}"</strong>.
            This action cannot be undone.
          </p>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            id="delete-cancel-btn"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            id="delete-confirm-btn"
            className="btn btn-danger"
            onClick={handleConfirm}
            autoFocus
          >
            <Trash2 size={15} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
