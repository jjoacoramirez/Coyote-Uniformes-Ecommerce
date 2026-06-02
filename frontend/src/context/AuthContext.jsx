/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'
import { api } from '../services/api.js'

const AuthContext = createContext(null)

function decodeToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const rawRole = payload.roles?.[0]?.authority ?? 'ROLE_USER'
    return {
      email: payload.sub,
      role: rawRole === 'ROLE_ADMIN' ? 'admin' : 'cliente',
    }
  } catch {
    return null
  }
}

function getStoredUser() {
  const rawUser = localStorage.getItem('coyote_user')
  return rawUser ? JSON.parse(rawUser) : null
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)

  const login = async (email, password) => {
    try {
      const { token } = await api.post('/auth/login', { email, password })
      const decoded = decodeToken(token)
      if (!decoded) return { ok: false, message: 'Error al procesar el token.' }

      localStorage.setItem('coyote_token', token)
      const sessionUser = { email: decoded.email, role: decoded.role }
      localStorage.setItem('coyote_user', JSON.stringify(sessionUser))
      setUser(sessionUser)
      return { ok: true, user: sessionUser }
    } catch (err) {
      return { ok: false, message: err.message ?? 'Correo o contrasena incorrectos.' }
    }
  }

  const register = (formData) => {
    const sessionUser = {
      id: Date.now(),
      name: `${formData.name} ${formData.lastName}`.trim(),
      email: formData.email,
      role: 'cliente',
    }
    localStorage.setItem('coyote_user', JSON.stringify(sessionUser))
    setUser(sessionUser)
    return sessionUser
  }

  const logout = () => {
    localStorage.removeItem('coyote_token')
    localStorage.removeItem('coyote_user')
    setUser(null)
  }

  const value = useMemo(() => ({ user, login, register, logout }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
