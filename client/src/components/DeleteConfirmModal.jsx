import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  application,
  onClose,
  onConfirm,
  isDeleting = false
}) {
  if (!isOpen || !application) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-modal" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                Delete Application
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                This action cannot be undone.
              </p>
            </div>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Are you sure you want to remove your application for <strong style={{ color: '#fff' }}>{application.role}</strong> at <strong style={{ color: '#fff' }}>{application.company}</strong>?
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <button className="btn btn-secondary" onClick={onClose} disabled={isDeleting}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={onConfirm} disabled={isDeleting}>
              <Trash2 size={14} />
              <span>{isDeleting ? 'Deleting...' : 'Delete Application'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
