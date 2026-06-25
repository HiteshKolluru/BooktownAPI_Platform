import { useState } from 'react'
import { useQuery, useMutation, useLazyQuery } from '@apollo/client'
import {
  GET_AUTHORS,
  SEARCH_AUTHORS_BY_LASTNAME,
  TITLES_BY_AUTHOR_FIRSTNAME,
} from '../graphql/queries'
import { ADD_AUTHOR, UPDATE_AUTHOR_LASTNAME } from '../graphql/mutations'
import AuthorCard from '../components/AuthorCard'
import Modal from '../components/Modal'
import { Loading, ErrorState, Empty } from '../components/States'
import { useAuth } from '../auth/AuthContext'

export default function Authors() {
  const { isAuthenticated, openLogin } = useAuth()
  const requireAuth = (action) => (isAuthenticated ? action() : openLogin())
  const [lastNameFilter, setLastNameFilter] = useState('')
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState(null)
  const [newLast, setNewLast] = useState('')
  const [form, setForm] = useState({ firstName: '', lastName: '' })
  const [formError, setFormError] = useState('')

  const filtering = lastNameFilter.trim().length > 0
  const all = useQuery(GET_AUTHORS)
  const filtered = useQuery(SEARCH_AUTHORS_BY_LASTNAME, {
    variables: { lastName: lastNameFilter.trim() },
    skip: !filtering,
  })

  const authors = filtering
    ? (filtered.data?.authorsByLastName || [])
    : (all.data?.authors || [])
  const loading = filtering ? filtered.loading : all.loading
  const error = all.error || filtered.error

  // "Books by first name" — uses bookTitlesByAuthorFirstName
  const [firstName, setFirstName] = useState('')
  const [runTitles, titlesState] = useLazyQuery(TITLES_BY_AUTHOR_FIRSTNAME)
  const titles = titlesState.data?.bookTitlesByAuthorFirstName || []

  const [addAuthor, addState] = useMutation(ADD_AUTHOR, {
    refetchQueries: [{ query: GET_AUTHORS }],
  })
  const [updateLastName, updateState] = useMutation(UPDATE_AUTHOR_LASTNAME, {
    refetchQueries: [{ query: GET_AUTHORS }],
  })

  async function handleAdd(e) {
    e.preventDefault()
    setFormError('')
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setFormError('Both names are required.')
      return
    }
    try {
      await addAuthor({ variables: { input: {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
      } } })
      setForm({ firstName: '', lastName: '' })
      setAdding(false)
    } catch (err) { setFormError(err.message) }
  }

  function openEdit(author) {
    setEditing(author)
    setNewLast(author.lastName || '')
  }

  async function handleEdit(e) {
    e.preventDefault()
    if (!newLast.trim()) return
    await updateLastName({ variables: { input: { id: editing.id, newLastName: newLast.trim() } } })
    setEditing(null)
  }

  return (
    <div className="page">
      <div className="container">
        <div className="eyebrow">The Writers</div>
        <div className="row-between">
          <h1 className="mb-0">Authors</h1>
          <button className="btn btn-primary" onClick={() => requireAuth(() => setAdding(true))}>+ Add an author</button>
        </div>
        <div className="ornament" />

        {/* Tools */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginBottom: '1.75rem' }}>
          <div className="card" style={{ padding: '1rem 1.1rem' }}>
            <label className="field" style={{ margin: 0 }}>
              <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-soft)', marginBottom: '0.35rem' }}>
                Filter by last name
              </span>
              <input
                className="input"
                placeholder="e.g. Tolkien"
                value={lastNameFilter}
                onChange={(e) => setLastNameFilter(e.target.value)}
              />
            </label>
          </div>

          <div className="card" style={{ padding: '1rem 1.1rem' }}>
            <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-soft)', marginBottom: '0.35rem' }}>
              Titles by author’s first name
            </span>
            <form
              className="row"
              onSubmit={(e) => { e.preventDefault(); if (firstName.trim()) runTitles({ variables: { firstName: firstName.trim() } }) }}
            >
              <input
                className="input"
                placeholder="e.g. John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <button className="btn btn-ghost" type="submit">Find</button>
            </form>
            {titlesState.called && !titlesState.loading && (
              <div className="mt-1" style={{ fontSize: '0.9rem' }}>
                {titles.length === 0
                  ? <span className="faint">No titles found.</span>
                  : <div className="wrap">{titles.map((t, i) => <span key={i} className="badge badge-muted">{t}</span>)}</div>}
              </div>
            )}
          </div>
        </div>

        {error && <ErrorState error={error} />}
        {!error && loading && <Loading />}
        {!error && !loading && authors.length === 0 && (
          <Empty
            title={filtering ? 'No authors by that name' : 'No authors yet'}
            hint={filtering ? 'Try a different last name.' : 'Add the first author to get started.'}
          />
        )}
        {!error && !loading && authors.length > 0 && (
          <div className="grid grid-authors">
            {authors.map((a, i) => (
              <AuthorCard key={a.id} author={a} onEditLastName={(author) => requireAuth(() => openEdit(author))} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* Add author modal */}
      <Modal open={adding} onClose={() => setAdding(false)} title="Add an author">
        <form onSubmit={handleAdd}>
          <div className="field">
            <label>First name</label>
            <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          </div>
          <div className="field">
            <label>Last name</label>
            <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </div>
          {formError && <div className="error-box">{formError}</div>}
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setAdding(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={addState.loading}>
              {addState.loading ? 'Adding…' : 'Add author'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit last name modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit last name">
        <form onSubmit={handleEdit}>
          <p className="muted" style={{ fontSize: '0.92rem' }}>
            Updating <strong>{editing?.firstName} {editing?.lastName}</strong>.
          </p>
          <div className="field">
            <label>New last name</label>
            <input value={newLast} onChange={(e) => setNewLast(e.target.value)} autoFocus />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={updateState.loading}>
              {updateState.loading ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
