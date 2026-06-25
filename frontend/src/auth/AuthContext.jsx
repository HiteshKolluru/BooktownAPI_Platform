import { createContext, useContext, useState, useCallback } from 'react'
import { getToken, getUser, saveAuth, clearAuth } from './token'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getToken())
  const [username, setUsername] = useState(() => getUser())
  const [loginOpen, setLoginOpen] = useState(false)

  const login = useCallback((tok, user) => {
    saveAuth(tok, user)
    setToken(tok)
    setUsername(user)
    setLoginOpen(false)
  }, [])

  const logout = useCallback(() => {
    clearAuth()
    setToken(null)
    setUsername(null)
  }, [])

  const openLogin = useCallback(() => setLoginOpen(true), [])
  const closeLogin = useCallback(() => setLoginOpen(false), [])

  const value = {
    token,
    username,
    isAuthenticated: !!token,
    login,
    logout,
    loginOpen,
    openLogin,
    closeLogin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
