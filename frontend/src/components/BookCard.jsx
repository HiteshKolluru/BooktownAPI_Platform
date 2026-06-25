import { motion } from 'framer-motion'
import './BookCard.css'

// Deterministic spine color from the ISBN/title so each book looks distinct
// but stable across renders — like spines on a shelf.
const SPINES = ['#7c2d12', '#9a3412', '#854d0e', '#3f6212', '#155e63', '#4c1d95', '#831843']
function spineColor(key = '') {
  let h = 0
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0
  return SPINES[h % SPINES.length]
}

export default function BookCard({ book, authorName, onDelete, index = 0 }) {
  const color = spineColor(book.isbn || book.title)
  return (
    <motion.article
      className="book-card card"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
      whileHover={{ y: -4 }}
    >
      <div className="book-spine" style={{ background: color }} />
      <div className="book-body">
        <h3 className="book-title" title={book.title}>{book.title}</h3>
        <p className="book-author muted">
          {authorName ? `by ${authorName}` : `Author #${book.authorId}`}
        </p>
        <div className="book-foot">
          <span className="badge badge-muted mono">{book.isbn}</span>
          {onDelete && (
            <button
              className="btn btn-danger btn-sm"
              onClick={() => onDelete(book)}
              aria-label={`Delete ${book.title}`}
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </motion.article>
  )
}
