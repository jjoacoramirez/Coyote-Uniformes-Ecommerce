function ToastNotif({ message }) {
  if (!message) return null

  return (
    <div className="toast" role="status" aria-live="polite">
      {message}
    </div>
  )
}

export default ToastNotif
