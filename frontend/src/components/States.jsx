export function Loading({ label = 'Fetching from the stacks…' }) {
  return (
    <div className="state">
      <div className="spinner" />
      <p className="muted mb-0">{label}</p>
    </div>
  )
}

export function ErrorState({ error }) {
  return (
    <div className="state">
      <div className="error-box" style={{ display: 'inline-block', textAlign: 'left' }}>
        <strong>Couldn’t reach the bookstore.</strong>
        <div className="mt-1" style={{ fontSize: '0.85rem' }}>
          {error?.message || 'Unknown error.'}
        </div>
        <div className="faint mt-1" style={{ fontSize: '0.8rem' }}>
          Is the backend running on <span className="mono">localhost:8080</span>? Start it with{' '}
          <span className="mono">./gradlew bootRun</span> in <span className="mono">Activity2/BooktownGraphQl</span>.
        </div>
      </div>
    </div>
  )
}

export function Empty({ title = 'Nothing here yet', hint }) {
  return (
    <div className="state">
      <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📖</div>
      <h3 style={{ marginBottom: '0.25rem' }}>{title}</h3>
      {hint && <p className="muted mb-0">{hint}</p>}
    </div>
  )
}
