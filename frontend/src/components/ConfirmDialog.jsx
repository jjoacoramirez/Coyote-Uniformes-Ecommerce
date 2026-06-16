import { useEffect } from 'react'

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Eliminar',
  loading = false,
}) {
  useEffect(() => {
    if (!isOpen) return
    function onKey(e) {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div
        className="confirm-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
      >
        <div className="confirm-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <h3 className="confirm-title" id="confirm-title">{title}</h3>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button
            className="button secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className="button confirm-danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Eliminando...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
