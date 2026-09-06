function Loading({ label = 'Loading...' }) {
  return (
    <div className="loading" role="status" aria-live="polite">
      {label}
    </div>
  )
}

export default Loading
