// Tiny localStorage-backed token store. Kept separate from React so the Apollo
// client (a non-component module) can read the token on every request.
const TOKEN_KEY = 'booktown_token'
const USER_KEY = 'booktown_user'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const getUser = () => localStorage.getItem(USER_KEY)

export function saveAuth(token, username) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, username)
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
