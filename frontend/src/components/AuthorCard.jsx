import { useState } from 'react'
import { motion } from 'framer-motion'
import './AuthorCard.css'

function initials(first = '', last = '') {
  return ((first[0] || '') + (last[0] || '')).toUpperCase() || '?'
}

export default function AuthorCard({ author, onEditLastName, index = 0 }) {
  const [open, setOpen] = useState(false)
  const books = author.books || []

  return (
    <motion.article
      className="author-card card"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
      whileHover={{ y: -4 }}
    >
      <div className="author-head">
        <div className="medallion">{initials(author.firstName, author.lastName)}</div>
        <div style={{ minWidth: 0 }}>
          <h3 className="author-name">
            {author.firstName} {author.lastName}
          </h3>
          <span className="badge">{books.length} {books.length === 1 ? 'book' : 'books'}</span>
        </div>
      </div>

      <div className="author-actions">
        <button className="btn btn-ghost btn-sm" onClick={() => setOpen((v) => !v)}>
          {open ? 'Hide books' : 'View books'}
        </button>
        {onEditLastName && (
          <button className="btn btn-ghost btn-sm" onClick={() => onEditLastName(author)}>
            Edit name
          </button>
        )}
      </div>

      {open && (
        <motion.ul
          className="author-books"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          {books.length === 0 && <li className="faint">No books on record.</li>}
          {books.map((b) => (
            <li key={b.isbn}>
              <span className="dot">•</span> {b.title}
            </li>
          ))}
        </motion.ul>
      )}
    </motion.article>
  )
}
