import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../graphql/mutations'
import { useAuth } from '../auth/AuthContext'
import Modal from './Modal'

export default function LoginModal() {
  const { loginOpen, closeLogin, login } = useAuth()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [doLogin, { loading }] = useMutation(LOGIN)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const { data } = await doLogin({ variables: { input: { ...form } } })
      const payload = data?.login
      if (payload?.token) {
        login(payload.token, payload.username)
        setForm({ username: '', password: '' })
      } else {
        setError('Login failed. Please try again.')
      }
    } catch (err) {
      setError(err.message || 'Invalid username or password.')
    }
  }

  return (
    <Modal open={loginOpen} onClose={closeLogin} title="Admin sign in">
      <p className="muted" style={{ fontSize: '0.92rem', marginTop: '-0.5rem' }}>
        Writing to the catalog (add / edit / delete) requires an admin account.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Username</label>
          <input
            autoFocus
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
        </div>
        <div className="field">
          <label>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        {error && <div className="error-box">{error}</div>}
        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={closeLogin}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
