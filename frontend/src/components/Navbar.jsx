import { NavLink } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import './Navbar.css'

const links = [
  { to: '/',         label: 'Home',     end: true },
  { to: '/books',    label: 'Books' },
  { to: '/authors',  label: 'Authors' },
  { to: '/explorer', label: 'Explorer' },
  { to: '/about',    label: 'About' },
]

export default function Navbar() {
  const { isAuthenticated, username, openLogin, logout } = useAuth()
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="brand" end>
          <span className="brand-mark">✦</span>
          <span className="brand-name">Booktown</span>
        </NavLink>
        <nav className="nav-links">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
            >
              {l.label}
            </NavLink>
          ))}
          {isAuthenticated ? (
            <span className="auth-control">
              <span className="auth-user" title="Signed in as admin">● {username}</span>
              <button className="btn btn-ghost btn-sm" onClick={logout}>Logout</button>
            </span>
          ) : (
            <button className="btn btn-primary btn-sm auth-login-btn" onClick={openLogin}>
              Sign in
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}
