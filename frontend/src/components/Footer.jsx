export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--card-edge)',
        background: 'var(--paper-2)',
        padding: '2rem 0',
        marginTop: '2rem',
      }}
    >
      <div className="container row-between">
        <span className="muted" style={{ fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--amber)' }}>✦</span> Booktown · A GraphQL Bookstore
        </span>
        <span className="faint" style={{ fontSize: '0.85rem' }}>
          ~ established MMXXVI · Phase 1 of the Booktown API Platform ~
        </span>
      </div>
    </footer>
  )
}
