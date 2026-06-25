import { useState, useMemo } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_BOOKS, GET_AUTHORS, SEARCH_BOOKS_BY_TITLE } from '../graphql/queries'
import { ADD_BOOK, DELETE_BOOK } from '../graphql/mutations'
import BookCard from '../components/BookCard'
import Modal from '../components/Modal'
import { Loading, ErrorState, Empty } from '../components/States'

export default function Books() {
  const [term, setTerm] = useState('')
  const [adding, setAdding] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [form, setForm] = useState({ isbn: '', title: '', authorId: '' })
  const [formError, setFormError] = useState('')

  const trimmed = term.trim()
  const searching = trimmed.length > 0

  const all = useQuery(GET_BOOKS)
  const authorsQ = useQuery(GET_AUTHORS)
  const search = useQuery(SEARCH_BOOKS_BY_TITLE, {
    variables: { substring: trimmed },
    skip: !searching,
  })

  const authors = authorsQ.data?.authors || []
  const authorName = (id) => {
    const a = authors.find((x) => String(x.id) === String(id))
    return a ? `${a.firstName} ${a.lastName}` : null
  }

  const books = searching ? (search.data?.booksByTitleSubstring || []) : (all.data?.books || [])
  const loading = searching ? search.loading : all.loading
  const error = all.error || search.error

  const [addBook, addState] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: GET_BOOKS }, { query: GET_AUTHORS }],
  })
  const [deleteBook] = useMutation(DELETE_BOOK, {
    refetchQueries: [{ query: GET_BOOKS }, { query: GET_AUTHORS }],
  })

  const sortedAuthors = useMemo(
    () => [...authors].sort((a, b) => (a.lastName || '').localeCompare(b.lastName || '')),
    [authors],
  )

  async function handleAdd(e) {
    e.preventDefault()
    setFormError('')
    if (!form.isbn.trim() || !form.title.trim() || form.authorId === '') {
      setFormError('All fields are required.')
      return
    }
    try {
      await addBook({ variables: { input: {
        isbn: form.isbn.trim(),
        title: form.title.trim(),
        authorId: form.authorId,
      } } })
      setForm({ isbn: '', title: '', authorId: '' })
      setAdding(false)
    } catch (err) {
      setFormError(err.message)
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return
    await deleteBook({ variables: { input: { isbn: pendingDelete.isbn } } })
    setPendingDelete(null)
  }

  return (
    <div className="page">
      <div className="container">
        <div className="eyebrow">The Catalog</div>
        <div className="row-between">
          <h1 className="mb-0">Books</h1>
          <button className="btn btn-primary" onClick={() => setAdding(true)}>+ Add a book</button>
        </div>
        <div className="ornament" />

        <div className="row-between mt-2" style={{ marginBottom: '1.5rem' }}>
          <div className="search">
            <span className="search-icon">⌕</span>
            <input
              className="input"
              placeholder="Search by title…"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
          </div>
          <span className="muted" style={{ fontSize: '0.9rem' }}>
            {searching
              ? `${books.length} match${books.length === 1 ? '' : 'es'} for “${trimmed}”`
              : `${books.length} book${books.length === 1 ? '' : 's'}`}
          </span>
        </div>

        {error && <ErrorState error={error} />}
        {!error && loading && <Loading />}
        {!error && !loading && books.length === 0 && (
          <Empty
            title={searching ? 'No matching titles' : 'The catalog is empty'}
            hint={searching ? 'Try a different search term.' : 'Add the first book to get started.'}
          />
        )}
        {!error && !loading && books.length > 0 && (
          <div className="grid grid-books">
            {books.map((b, i) => (
              <BookCard
                key={b.isbn}
                book={b}
                authorName={authorName(b.authorId)}
                onDelete={setPendingDelete}
                index={i}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add book modal */}
      <Modal open={adding} onClose={() => setAdding(false)} title="Add a book">
        <form onSubmit={handleAdd}>
          <div className="field">
            <label>ISBN</label>
            <input value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} placeholder="e.g. 0385472579" />
          </div>
          <div className="field">
            <label>Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Book title" />
          </div>
          <div className="field">
            <label>Author</label>
            <select
              className="input"
              value={form.authorId}
              onChange={(e) => setForm({ ...form, authorId: e.target.value })}
            >
              <option value="">Select an author…</option>
              {sortedAuthors.map((a) => (
                <option key={a.id} value={a.id}>{a.firstName} {a.lastName}</option>
              ))}
            </select>
          </div>
          {formError && <div className="error-box">{formError}</div>}
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setAdding(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={addState.loading}>
              {addState.loading ? 'Adding…' : 'Add book'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <Modal open={!!pendingDelete} onClose={() => setPendingDelete(null)} title="Remove this book?">
        <p className="muted">
          You’re about to remove <strong>{pendingDelete?.title}</strong> (
          <span className="mono">{pendingDelete?.isbn}</span>) from the catalog.
        </p>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={() => setPendingDelete(null)}>Cancel</button>
          <button className="btn btn-danger" onClick={confirmDelete}>Remove book</button>
        </div>
      </Modal>
    </div>
  )
}
